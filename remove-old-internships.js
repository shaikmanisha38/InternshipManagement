const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.internship.deleteMany({
    where: {
      NOT: {
        title: {
          contains: '(60 Days)'
        }
      }
    }
  });
  console.log(`Deleted ${deleted.count} old dummy internships!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
