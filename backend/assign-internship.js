const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    include: { studentInternships: true }
  });

  const firstInternship = await prisma.internship.findFirst();
  if (!firstInternship) {
    console.log("No internships found in the DB. Please create an internship first.");
    return;
  }

  let assignedCount = 0;
  for (const user of users) {
    if (user.studentInternships.length === 0) {
      await prisma.studentInternship.create({
        data: {
          studentId: user.id,
          internshipId: firstInternship.id,
          status: 'ONGOING',
          progress: 0.0,
          currentWeek: 4,
          currentDay: 12,
          startDate: new Date()
        }
      });
      assignedCount++;
      console.log(`Assigned internship to user: ${user.email}`);
    }
  }

  console.log(`Successfully assigned internships to ${assignedCount} users.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
