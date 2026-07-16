const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

async function main() {
  const roles = await prisma.role.findMany();
  console.log('Roles:', roles);
  
  if (roles.length === 0) {
    console.log('Seeding roles...');
    await prisma.role.createMany({
      data: [
        { roleName: 'STUDENT' },
        { roleName: 'MENTOR' },
        { roleName: 'ADMIN' },
      ],
    });
    console.log('Roles seeded successfully.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
