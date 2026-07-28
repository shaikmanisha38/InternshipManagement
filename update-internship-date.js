require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(12, 0, 0, 0);

  // Find the student
  const student = await prisma.user.findFirst({
    where: { role: { roleName: 'STUDENT' } }
  });

  if (!student) {
    console.log("No student found");
    return;
  }

  // Backdate internship
  const updated = await prisma.studentInternship.updateMany({
    where: { studentId: student.id, status: 'ONGOING' },
    data: { 
      startDate: yesterday,
      currentDay: 2
    }
  });
  console.log(`Updated ${updated.count} active internships to start yesterday (Day 2).`);

  // Find a task to submit
  const studentInternship = await prisma.studentInternship.findFirst({
    where: { studentId: student.id, status: 'ONGOING' },
    include: {
      internship: {
        include: { roadmaps: { include: { roadmapDays: { include: { tasks: true } } } } }
      }
    }
  });

  if (studentInternship && studentInternship.internship.roadmaps.length > 0) {
    const firstDay = studentInternship.internship.roadmaps[0].roadmapDays[0];
    if (firstDay && firstDay.tasks.length > 0) {
      const task = firstDay.tasks[0];

      // Check if submission exists
      const existingSub = await prisma.taskSubmission.findFirst({
        where: { userId: student.id, taskId: task.id }
      });

      if (!existingSub) {
        await prisma.taskSubmission.create({
          data: {
            userId: student.id,
            taskId: task.id,
            repositoryUrl: 'https://github.com/shaikmanisha38/InternshipManagement',
            branch: 'main',
            commitHash: 'a1b2c3d4',
            notes: 'Completed day 1 task',
            status: 'VERIFIED',
            submittedAt: yesterday
          }
        });
        console.log("Created dummy TaskSubmission for yesterday.");
      } else {
        await prisma.taskSubmission.update({
          where: { id: existingSub.id },
          data: { submittedAt: yesterday, status: 'VERIFIED' }
        });
        console.log("Updated existing TaskSubmission to yesterday.");
      }
    }
  }

  // Create attendance for yesterday
  const existingAtt = await prisma.attendance.findFirst({
    where: { 
      studentId: student.id,
      date: new Date(yesterday.toISOString().split('T')[0] + 'T00:00:00.000Z')
    }
  });

  if (!existingAtt) {
    const login = new Date(yesterday);
    login.setHours(9, 0, 0, 0);
    const logout = new Date(yesterday);
    logout.setHours(17, 0, 0, 0);

    await prisma.attendance.create({
      data: {
        studentId: student.id,
        loginTime: login,
        logoutTime: logout,
        hoursSpent: 8.0,
        date: new Date(yesterday.toISOString().split('T')[0] + 'T00:00:00.000Z')
      }
    });
    console.log("Created dummy Attendance for yesterday.");
  }

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
