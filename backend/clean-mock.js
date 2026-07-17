const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$executeRawUnsafe(`UPDATE task_submissions SET status = 'PENDING' WHERE status = 'APPROVED' OR status = 'REJECTED';`);
  
  // Also clear github_accounts and github_commits just to avoid unique constraint issues
  await prisma.$executeRawUnsafe(`DELETE FROM github_commits;`);
  await prisma.$executeRawUnsafe(`DELETE FROM github_accounts;`);
  
  console.log('Cleaned up mock data for enum migration');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
