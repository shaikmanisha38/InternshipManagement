import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

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

    const { searchParams } = new URL(req.url);
    const collegeFilter = searchParams.get('college');
    const deptFilter = searchParams.get('dept');
    const batchFilter = searchParams.get('batch');
    // We could apply timeframe to limit points calculation to just 'this week', but for global rank 'All Time' is standard.
    // Timeframe is provided, we can dynamically scope some queries if needed.

    const mentoredInternships = await prisma.studentInternship.findMany({
      where: { internship: { mentorId } },
      select: { studentId: true }
    });
    const mentoredProjects = await prisma.projectStudent.findMany({
      where: { project: { mentorId } },
      select: { studentId: true }
    });
    const studentIds = [...new Set([...mentoredInternships.map(i => i.studentId), ...mentoredProjects.map(p => p.studentId)])];

    const whereClause: any = { id: { in: studentIds } };
    if (collegeFilter && collegeFilter !== 'All Colleges') whereClause.college = collegeFilter;
    if (deptFilter && deptFilter !== 'All Departments') whereClause.department = deptFilter;
    if (batchFilter && batchFilter !== 'All Batches') whereClause.year = parseInt(batchFilter, 10);

    const students = await prisma.user.findMany({
      where: whereClause,
      include: {
        leaderboard: true,
        studentBadges: { include: { badge: true } },
        attendance: true,
        taskSubmissions: { include: { aiEvaluation: true } }
      }
    });

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    let flawlessCount = 0;
    let highestAiScore = 0;
    let highestAiStudent = null;

    let mostImprovedScore = -1;
    let mostImprovedStudent = null;

    let tableData = students.map(student => {
      let points = student.leaderboard?.points || 0;
      let weeklyPoints = 0;

      student.taskSubmissions.forEach(sub => {
        if (new Date(sub.submittedAt) >= sevenDaysAgo) weeklyPoints += 50; 
      });
      student.attendance.forEach(att => {
        if (new Date(att.date) >= sevenDaysAgo && att.status === 'Present') weeklyPoints += 10;
      });

      if (weeklyPoints > mostImprovedScore) {
        mostImprovedScore = weeklyPoints;
        mostImprovedStudent = { name: student.name, avatar: student.profileImage, jump: weeklyPoints };
      }

      const badges = student.studentBadges.map(sb => sb.badge.name);

      const totalDays = student.attendance.length || 1;
      const presentDays = student.attendance.filter(a => a.status === 'Present').length;
      const attendancePercent = Math.round((presentDays / totalDays) * 100);
      
      if (attendancePercent === 100 && student.attendance.length > 0) flawlessCount++;

      const evals = student.taskSubmissions.filter(sub => sub.aiEvaluation).map(sub => sub.aiEvaluation?.score || 0);
      const avgAiScore = evals.length > 0 ? Math.round(evals.reduce((a,b) => a+b, 0) / evals.length) : 0;
      
      if (avgAiScore > highestAiScore) {
        highestAiScore = avgAiScore;
        highestAiStudent = { name: student.name, avatar: student.profileImage, score: avgAiScore };
      }

      const totalAssigned = Math.max(student.taskSubmissions.length, 40);
      const tasksCompleted = student.taskSubmissions.filter(sub => sub.status === 'VERIFIED').length;

      return {
        key: student.id,
        name: student.name,
        email: student.email,
        avatar: student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`,
        points,
        badges,
        attendance: attendancePercent,
        aiScore: avgAiScore,
        tasksCompleted,
        totalTasks: totalAssigned,
        college: student.college || 'Unknown',
        department: student.department || 'Unknown',
        batch: student.year ? `Batch ${student.year}` : 'Unknown'
      };
    });

    tableData.sort((a, b) => b.points - a.points);
    tableData = tableData.map((row, idx) => ({ ...row, rank: idx + 1 }));

    const topCount = Math.max(1, Math.floor(tableData.length * 0.1));
    const apexStudents = tableData.slice(0, topCount);
    const avgApexPoints = apexStudents.length > 0 ? Math.round(apexStudents.reduce((a,b) => a + b.points, 0) / apexStudents.length) : 0;

    return NextResponse.json({
      data: tableData,
      metrics: {
        apexRunners: {
          count: topCount,
          avgPoints: avgApexPoints
        },
        mostImproved: mostImprovedStudent || { name: 'N/A', avatar: null, jump: 0 },
        highestAi: highestAiStudent || { name: 'N/A', avatar: null, score: 0 },
        flawlessCount
      }
    });

  } catch (error: any) {
    console.error('Error fetching mentor leaderboard:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
