const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.studentInternship.updateMany({
    data: {
      currentDay: 2
    }
  });

  const deleteSub = await prisma.taskSubmission.deleteMany({});
  
  console.log(`Updated ${result.count} student internships to Day 2 and cleared ${deleteSub.count} submissions to remove today's locks.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
