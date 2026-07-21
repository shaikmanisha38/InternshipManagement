import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import ExcelJS from 'exceljs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

async function getMentorId(req: Request) {
  const authHeader = req.headers.get('authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const role = verified.payload.role as string;
    if (role !== 'MENTOR' && role !== 'ADMIN') return null;
    return verified.payload.userId as string;
  } catch { return null; }
}

export async function GET(req: Request) {
  try {
    const mentorId = await getMentorId(req);
    if (!mentorId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'student-progress';
    const format = url.searchParams.get('format') || 'xlsx';

    const mentoredInternships = await prisma.studentInternship.findMany({
      where: { internship: { mentorId } },
      select: { studentId: true }
    });
    const mentoredProjects = await prisma.projectStudent.findMany({
      where: { project: { mentorId } },
      select: { studentId: true }
    });
    const studentIds = [...new Set([...mentoredInternships.map(i => i.studentId), ...mentoredProjects.map(p => p.studentId)])];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    let fileName = `report_${type}_${new Date().getTime()}`;

    if (type === 'student-progress') {
      worksheet.columns = [
        { header: 'Student ID', key: 'id', width: 25 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Total Tasks', key: 'totalTasks', width: 15 },
        { header: 'Completed Tasks', key: 'completedTasks', width: 20 },
      ];

      const users = await prisma.user.findMany({
        where: { id: { in: studentIds } },
        include: { taskSubmissions: true }
      });

      users.forEach(u => {
        worksheet.addRow({
          id: u.id,
          name: u.name,
          email: u.email,
          totalTasks: u.taskSubmissions.length,
          completedTasks: u.taskSubmissions.filter(ts => ts.status === 'VERIFIED').length,
        });
      });
    } else if (type === 'attendance') {
      worksheet.columns = [
        { header: 'Student ID', key: 'id', width: 25 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Hours Spent', key: 'hours', width: 15 },
      ];

      const attendances = await prisma.attendance.findMany({
        where: { studentId: { in: studentIds } },
        include: { student: true }
      });

      attendances.forEach(a => {
        worksheet.addRow({
          id: a.studentId,
          name: a.student.name,
          date: a.date.toISOString().split('T')[0],
          status: a.status,
          hours: a.hoursSpent || 0,
        });
      });
    } else if (type === 'assessments') {
      worksheet.columns = [
        { header: 'Student ID', key: 'id', width: 25 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Assessment Title', key: 'title', width: 30 },
        { header: 'Score', key: 'score', width: 15 },
        { header: 'Passed', key: 'passed', width: 15 },
      ];

      const submissions = await prisma.assessmentSubmission.findMany({
        where: { userId: { in: studentIds } },
        include: { user: true, assessment: true }
      });

      submissions.forEach(s => {
        worksheet.addRow({
          id: s.userId,
          name: s.user.name,
          title: s.assessment.title,
          score: s.scoreObtained,
          passed: s.passed ? 'Yes' : 'No',
        });
      });
    } else if (type === 'ai-performance') {
      worksheet.columns = [
        { header: 'Student ID', key: 'id', width: 25 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Task Title', key: 'title', width: 30 },
        { header: 'AI Score', key: 'score', width: 15 },
      ];

      const evals = await prisma.aiEvaluation.findMany({
        where: { submission: { userId: { in: studentIds } } },
        include: { submission: { include: { user: true, task: true } } }
      });

      evals.forEach(e => {
        worksheet.addRow({
          id: e.submission.userId,
          name: e.submission.user.name,
          title: e.submission.task.title,
          score: e.score,
        });
      });
    } else if (type === 'projects') {
      worksheet.columns = [
        { header: 'Student ID', key: 'id', width: 25 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Project Title', key: 'title', width: 30 },
        { header: 'Progress %', key: 'progress', width: 15 },
      ];

      const trackers = await prisma.taskTracker.findMany({
        where: { studentId: { in: studentIds } },
        include: { student: true, project: true }
      });

      trackers.forEach(t => {
        worksheet.addRow({
          id: t.studentId,
          name: t.student.name,
          title: t.project.title,
          progress: t.progress,
        });
      });
    }

    let buffer;
    let contentType;
    if (format === 'csv') {
      buffer = await workbook.csv.writeBuffer();
      contentType = 'text/csv';
      fileName += '.csv';
    } else {
      buffer = await workbook.xlsx.writeBuffer();
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileName += '.xlsx';
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      }
    });

  } catch (error: any) {
    console.error('Error exporting report:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
