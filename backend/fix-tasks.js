const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const tasks = await prisma.task.findMany();
  if (tasks.length === 0) {
    console.log('No tasks found to update.');
    return;
  }

  // Set the deadline to today
  const today = new Date();
  
  for (const task of tasks) {
    await prisma.task.update({
      where: { id: task.id },
      data: {
        deadline: today,
      }
    });
  }

  console.log(`Updated ${tasks.length} tasks with today's deadline.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
