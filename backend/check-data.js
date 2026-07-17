const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    include: {
      studentInternships: true
    }
  });
  console.log('--- USERS & INTERNSHIPS ---');
  console.log(JSON.stringify(users, null, 2));

  const roadmaps = await prisma.roadmap.findMany();
  console.log('--- ROADMAPS ---');
  console.log(JSON.stringify(roadmaps, null, 2));

  const tasks = await prisma.task.findMany();
  console.log('--- TASKS ---');
  console.log(JSON.stringify(tasks, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
