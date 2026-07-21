const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userId = 'test-id'; // We just want to see if the query compiles

    console.log('Testing overview query 1...');
    const mentoredStudentInternships = await prisma.studentInternship.findMany({
      where: { internship: { mentorId: userId } },
      select: { studentId: true, status: true, progress: true, startDate: true }
    });

    const uniqueStudentIds = [...new Set(mentoredStudentInternships.map(s => s.studentId))];
    
    console.log('Testing overview query 2...');
    await prisma.certificate.count({ where: { studentId: { in: uniqueStudentIds } } });

    console.log('Testing overview query 3...');
    const mentorTaskFilter = {
      task: { roadmapDay: { roadmap: { internship: { mentorId: userId } } } }
    };
    await prisma.taskSubmission.count({ where: { status: 'PENDING', ...mentorTaskFilter } });

    console.log('Testing overview query 4...');
    const startOfToday = new Date();
    await prisma.taskSubmission.count({
      where: { submittedAt: { gte: startOfToday, lte: startOfToday }, ...mentorTaskFilter }
    });

    console.log('Testing overview query 5...');
    await prisma.aiEvaluation.aggregate({
      _avg: { score: true },
      where: { submission: mentorTaskFilter }
    });

    console.log('Testing activity-trends query 1...');
    const sevenDaysAgo = new Date();
    await prisma.attendance.findMany({
      where: { studentId: { in: uniqueStudentIds }, date: { gte: sevenDaysAgo } },
      select: { date: true }
    });

    console.log('Testing activity-trends query 2...');
    await prisma.taskSubmission.findMany({
      where: { userId: { in: uniqueStudentIds }, status: 'VERIFIED', submittedAt: { gte: sevenDaysAgo } },
      select: { submittedAt: true }
    });

    console.log('Testing activity-trends query 3...');
    await prisma.taskSubmission.findMany({
      where: { userId: { in: uniqueStudentIds } },
      orderBy: { submittedAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } }, task: { select: { title: true } } }
    });

    console.log('Testing activity-trends query 4...');
    await prisma.aiEvaluation.findMany({
      where: { submission: { userId: { in: uniqueStudentIds } } },
      orderBy: { evaluatedAt: 'desc' },
      take: 10,
      include: { submission: { include: { user: { select: { name: true } } } } }
    });

    console.log('Testing activity-trends query 5...');
    await prisma.certificate.findMany({
      where: { studentId: { in: uniqueStudentIds } },
      orderBy: { issuedAt: 'desc' },
      take: 10,
      include: { student: { select: { name: true } } }
    });

    console.log('ALL PRISMA QUERIES PASSED!');
  } catch (err) {
    console.error('ERROR ENCOUNTERED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
