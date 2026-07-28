const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.studentInternship.updateMany({
    data: { currentDay: 6, currentWeek: 1 }
  });

  // clear any submissions for day 6 and 7 just in case
  await prisma.taskSubmission.deleteMany({});
  await prisma.assessmentSubmission.deleteMany({});

  console.log("Updated student internships to Day 6, Week 1. Cleared all submissions for fresh testing.");
}

main().finally(() => prisma.$disconnect());
