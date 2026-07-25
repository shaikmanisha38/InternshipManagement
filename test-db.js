const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  try {
    const count = await prisma.user.count();
    console.log('SUCCESS: Connected! Found', count, 'users.');
  } catch (e) {
    console.error('DB ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
