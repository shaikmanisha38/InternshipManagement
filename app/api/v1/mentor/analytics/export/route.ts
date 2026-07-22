import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

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

function buildPdf(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', err => reject(err));
    
    doc.fontSize(24).font('Helvetica-Bold').text('Cohort Analytics Executive Summary', { align: 'center' });
    doc.moveDown(2);
    
    doc.fontSize(14).font('Helvetica');
    const writeRow = (label: string, value: string) => {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true }).font('Helvetica').text(value);
      doc.moveDown(0.5);
    };

    writeRow('Active Students', String(data.activeCount));
    writeRow('Completed Cohort', String(data.completedCount));
    writeRow('Dropout Rate', `${data.dropoutRate}%`);
    writeRow('Average Score', `${data.avgScore}%`);
    writeRow('Average Git Commits', String(data.avgCommits));
    writeRow('Average Attendance', `${data.attendance}%`);
    
    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Oblique').text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();
  });
}

export async function GET(req: Request) {
  try {
    const mentorId = await getMentorId(req);
    if (!mentorId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    const mentoredInternships = await prisma.studentInternship.findMany({
      where: { internship: { mentorId } },
      select: { studentId: true }
    });
    const mentoredProjects = await prisma.projectStudent.findMany({
      where: { project: { mentorId } },
      select: { studentId: true }
    });
    const studentIds = [...new Set([...mentoredInternships.map(i => i.studentId), ...mentoredProjects.map(p => p.studentId)])];

    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      include: {
        taskSubmissions: { include: { aiEvaluation: true } },
        attendance: true,
        activityLogs: true,
        certificates: { where: { mentorId } }
      }
    });

    const now = new Date();
    let completedCount = 0;
    let inactiveCount = 0;
    let totalScoreSum = 0;
    let totalScoreCount = 0;
    let totalCommits = 0;
    let totalPresent = 0;
    let totalAttendanceExpected = 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    students.forEach(student => {
      const hasCertificate = student.certificates.length > 0;
      let scoreSum = 0;
      let evals = 0;
      student.taskSubmissions.forEach(sub => {
        if (sub.aiEvaluation) {
          scoreSum += sub.aiEvaluation.score;
          evals++;
        }
      });
      const avgScore = evals > 0 ? scoreSum / evals : 0;
      if (hasCertificate || avgScore >= 80) completedCount++;
      if (avgScore > 0) {
        totalScoreSum += avgScore;
        totalScoreCount++;
      }

      const recentActivity = student.activityLogs.some(log => new Date(log.createdAt) >= thirtyDaysAgo);
      const recentSubs = student.taskSubmissions.some(sub => new Date(sub.submittedAt) >= thirtyDaysAgo);
      if (!recentActivity && !recentSubs) inactiveCount++;

      const commits = student.activityLogs.filter(log => log.activity === 'GIT_COMMIT').length;
      totalCommits += commits;

      totalAttendanceExpected += Math.max(1, student.attendance.length);
      totalPresent += student.attendance.filter(a => a.status === 'Present').length;
    });

    const totalStudents = students.length || 1;
    const activeStudents = students.length - inactiveCount;
    const dropoutRate = (inactiveCount / totalStudents) * 100;
    const avgCohortScore = totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 0;
    const avgCohortAttendance = Math.round((totalPresent / (totalAttendanceExpected || 1)) * 100);

    const metrics = {
      activeCount: activeStudents,
      completedCount,
      dropoutRate: dropoutRate.toFixed(1),
      avgScore: avgCohortScore,
      avgCommits: Math.round(totalCommits / totalStudents),
      attendance: avgCohortAttendance
    };

    if (format === 'pdf') {
      const pdfBuffer = await buildPdf(metrics);
      return new NextResponse(pdfBuffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="analytics_summary.pdf"',
        },
      });
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Analytics');
      worksheet.columns = [
        { header: 'Metric', key: 'metric', width: 25 },
        { header: 'Value', key: 'value', width: 20 }
      ];
      worksheet.addRow({ metric: 'Active Students', value: metrics.activeCount });
      worksheet.addRow({ metric: 'Completed Students', value: metrics.completedCount });
      worksheet.addRow({ metric: 'Dropout Rate (%)', value: metrics.dropoutRate });
      worksheet.addRow({ metric: 'Average Score (%)', value: metrics.avgScore });
      worksheet.addRow({ metric: 'Average Git Commits', value: metrics.avgCommits });
      worksheet.addRow({ metric: 'Overall Attendance (%)', value: metrics.attendance });
      
      const csvBuffer = await workbook.csv.writeBuffer();
      return new NextResponse(csvBuffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="analytics_summary.csv"',
        },
      });
    }

  } catch (error: any) {
    console.error('Error generating export:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
