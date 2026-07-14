const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find a student
  const role = await prisma.role.findUnique({ where: { roleName: 'STUDENT' } });
  if (!role) throw new Error('Student role not found');
  
  let student = await prisma.user.findFirst({
    where: { roleId: role.id }
  });

  if (!student) {
     const bcrypt = require('bcrypt');
     const hashedPassword = await bcrypt.hash('password123', 10);
     student = await prisma.user.create({
        data: {
            name: 'Test Student',
            email: 'student@test.com',
            password: hashedPassword,
            roleId: role.id,
            profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        }
     });
     console.log('Created a dummy student');
  }

  const studentId = student.id;
  
  // 1. Leaderboard
  await prisma.leaderboard.upsert({
    where: { studentId },
    update: { points: 1500, rank: 4 },
    create: { studentId, points: 1500, rank: 4 }
  });

  // 2. Badges
  let badge1 = await prisma.badge.findUnique({ where: { badgeName: 'First Commit' }});
  if (!badge1) badge1 = await prisma.badge.create({ data: { badgeName: 'First Commit', description: '🚀', points: 10 } });
  
  let badge2 = await prisma.badge.findUnique({ where: { badgeName: 'Bug Smasher' }});
  if (!badge2) badge2 = await prisma.badge.create({ data: { badgeName: 'Bug Smasher', description: '🐛', points: 20 } });
  
  let badge3 = await prisma.badge.findUnique({ where: { badgeName: 'Code Reviewer' }});
  if (!badge3) badge3 = await prisma.badge.create({ data: { badgeName: 'Code Reviewer', description: '👀', points: 15 } });
  
  let badge4 = await prisma.badge.findUnique({ where: { badgeName: 'Perfect Attendance' }});
  if (!badge4) badge4 = await prisma.badge.create({ data: { badgeName: 'Perfect Attendance', description: '⏱️', points: 50 } });

  // Connect badges to student if not exist
  const existingBadges = await prisma.studentBadge.findMany({ where: { studentId } });
  if (existingBadges.length === 0) {
      await prisma.studentBadge.createMany({
          data: [
             { studentId, badgeId: badge1.id },
             { studentId, badgeId: badge2.id },
             { studentId, badgeId: badge3.id },
             { studentId, badgeId: badge4.id },
          ]
      });
  }

  // 3. Internship
  const mentorRole = await prisma.role.findUnique({ where: { roleName: 'MENTOR' } });
  let mentor = await prisma.user.findFirst({ where: { roleId: mentorRole.id } });
  if (!mentor) {
      mentor = await prisma.user.create({
          data: {
              name: 'Mentor Mike',
              email: 'mentor@test.com',
              password: 'password',
              roleId: mentorRole.id
          }
      });
  }

  let internship = await prisma.internship.findFirst({ where: { title: 'Frontend Engineer' } });
  if (!internship) {
      internship = await prisma.internship.create({
          data: {
              title: 'Frontend Engineer',
              description: 'Learn React',
              duration: '3 months',
              technology: 'React',
              difficulty: 'Beginner',
              mentorId: mentor.id
          }
      });
  }

  // StudentInternship
  let si = await prisma.studentInternship.findFirst({ where: { studentId, internshipId: internship.id } });
  if (!si) {
      si = await prisma.studentInternship.create({
          data: {
              studentId,
              internshipId: internship.id,
              startDate: new Date(),
              currentWeek: 4,
              currentDay: 12,
              status: 'ONGOING'
          }
      });
  } else {
      await prisma.studentInternship.update({
          where: { id: si.id },
          data: { currentWeek: 4, currentDay: 12, status: 'ONGOING' }
      });
  }

  // Roadmap & Tasks
  let roadmap = await prisma.roadmap.findFirst({ where: { internshipId: internship.id } });
  if (!roadmap) {
      roadmap = await prisma.roadmap.create({
          data: {
              internshipId: internship.id,
              weekNumber: 4,
              title: 'Advanced Frontend',
              description: 'Week 4 tasks'
          }
      });
  }

  let roadmapDay = await prisma.roadmapDay.findFirst({ where: { roadmapId: roadmap.id, dayNumber: 12 } });
  if (!roadmapDay) {
      roadmapDay = await prisma.roadmapDay.create({
          data: {
              roadmapId: roadmap.id,
              dayNumber: 12,
              title: 'React Context API'
          }
      });
  }

  let task = await prisma.task.findFirst({ where: { roadmapDayId: roadmapDay.id } });
  if (!task) {
      task = await prisma.task.create({
          data: {
              roadmapDayId: roadmapDay.id,
              title: 'Build Login API Integration',
              description: 'Connect frontend to backend',
              difficulty: 'Medium',
              estimatedTime: '3 Hours',
              unlockOrder: 1,
              passingScore: 70
          }
      });
  }

  // ActivityLogs
  const logsCount = await prisma.activityLog.count({ where: { userId: studentId } });
  if (logsCount === 0) {
      await prisma.activityLog.createMany({
          data: [
              { userId: studentId, activity: 'Logged in' },
              { userId: studentId, activity: 'Submitted Day 11 Task' },
              { userId: studentId, activity: 'AI Evaluation Completed' }
          ]
      });
  }

  // Assessment
  let assessment = await prisma.assessment.findFirst({ where: { title: 'Week 2 Assessment' } });
  if (!assessment) {
      assessment = await prisma.assessment.create({
          data: {
              week: 2,
              title: 'Week 2 Assessment',
              passingMarks: 70
          }
      });
  }

  let assessmentSubmission = await prisma.assessmentSubmission.findFirst({ where: { studentId, assessmentId: assessment.id } });
  if (!assessmentSubmission) {
      await prisma.assessmentSubmission.create({
          data: {
              studentId,
              assessmentId: assessment.id,
              score: 82
          }
      });
  }

  // Github
  let github = await prisma.githubAccount.findFirst({ where: { studentId } });
  if (!github) {
      github = await prisma.githubAccount.create({
          data: {
              studentId,
              githubId: '123456',
              username: 'teststudent'
          }
      });
  }

  // Submission for AI feedback
  let submission = await prisma.taskSubmission.findFirst({ where: { studentId, taskId: task.id } });
  if (!submission) {
      submission = await prisma.taskSubmission.create({
          data: {
              studentId,
              taskId: task.id,
              commitHash: 'abcdef123',
              status: 'APPROVED'
          }
      });
  }

  let aiEval = await prisma.aIEvaluation.findFirst({ where: { submissionId: submission.id } });
  if (!aiEval) {
      await prisma.aIEvaluation.create({
          data: {
              submissionId: submission.id,
              score: 82,
              strengths: 'Good folder structure',
              weaknesses: 'Improve naming conventions'
          }
      });
  }

  console.log('Database seeded with mock student data!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
