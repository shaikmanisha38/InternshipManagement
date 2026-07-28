import { prisma } from '@/lib/prisma';

export async function syncStudentProgress(userId: string) {
  const internship = await prisma.studentInternship.findFirst({
    where: { studentId: userId, status: 'ONGOING' }
  });
  if (!internship) return;

  const roadmap = await prisma.roadmap.findFirst({
    where: { internshipId: internship.internshipId, weekNumber: internship.currentWeek }
  });
  if (!roadmap) return;

  if (internship.currentDay < 7) {
    // Normal Task check for Days 1-6
    const roadmapDay = await prisma.roadmapDay.findFirst({
      where: { roadmapId: roadmap.id, dayNumber: internship.currentDay },
      include: { tasks: { orderBy: { unlockOrder: 'asc' } } }
    });
    
    if (!roadmapDay || roadmapDay.tasks.length === 0) return;

    // Check if there is a VERIFIED submission for the current day's task
    const taskId = roadmapDay.tasks[0].id;
    const verifiedSubmission = await prisma.taskSubmission.findFirst({
      where: { userId, taskId, status: 'VERIFIED' },
      orderBy: { submittedAt: 'desc' }
    });

    if (verifiedSubmission) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      // If the submission was verified before today, advance the day
      if (verifiedSubmission.submittedAt < startOfToday) {
        let nextDay = internship.currentDay + 1;
        let nextWeek = internship.currentWeek;
        
        await prisma.studentInternship.update({
          where: { id: internship.id },
          data: { currentDay: nextDay, currentWeek: nextWeek }
        });
        console.log(`[SyncProgress] Advanced student ${userId} to Week ${nextWeek}, Day ${nextDay}`);
      }
    }
  } else {
    // Day 7: Assessment check
    const assessment = await prisma.assessment.findFirst({
      where: { week: internship.currentWeek }
    });

    if (!assessment) return; // Wait until assessment exists

    const passedSubmission = await prisma.assessmentSubmission.findFirst({
      where: { userId, assessmentId: assessment.id, passed: true },
      orderBy: { completedAt: 'desc' }
    });

    if (passedSubmission) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      // Advance to next week, day 1 if assessment was passed BEFORE today
      if (passedSubmission.completedAt < startOfToday) {
        let nextDay = 1;
        let nextWeek = internship.currentWeek + 1;
        
        await prisma.studentInternship.update({
          where: { id: internship.id },
          data: { currentDay: nextDay, currentWeek: nextWeek }
        });
        console.log(`[SyncProgress] Advanced student ${userId} to Week ${nextWeek}, Day ${nextDay} (Assessment Passed)`);
      }
    }
  }
}
