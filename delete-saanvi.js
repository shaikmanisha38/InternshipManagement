const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const saanvi = await prisma.user.findFirst({
    where: { email: 'saanvi@gmail.com' }
  });

  if (saanvi) {
    // Delete any dependent records if necessary, though as an admin she probably doesn't have student records
    await prisma.user.delete({
      where: { id: saanvi.id }
    });
    console.log('Successfully deleted saanvi');
  } else {
    console.log('Saanvi not found');
  }
}

main().finally(() => prisma.$disconnect());
