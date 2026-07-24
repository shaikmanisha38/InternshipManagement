const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deletedInternships = await prisma.studentInternship.deleteMany({});
  console.log(`Deleted ${deletedInternships.count} old active student internships.`);

  const deletedApplications = await prisma.internshipApplication.deleteMany({});
  console.log(`Deleted ${deletedApplications.count} old applications.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
