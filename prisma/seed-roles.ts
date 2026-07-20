import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with roles and default users...');

  // 1. Ensure Roles exist
  const roles = ['STUDENT', 'MENTOR', 'ADMIN'];
  
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { roleName: roleName as any },
      update: {},
      create: { roleName: roleName as any },
    });
  }
  console.log('Roles verified.');

  // 2. Get Role IDs
  const adminRole = await prisma.role.findUnique({ where: { roleName: 'ADMIN' } });
  const mentorRole = await prisma.role.findUnique({ where: { roleName: 'MENTOR' } });

  if (!adminRole || !mentorRole) {
    throw new Error('Failed to find required roles');
  }

  // 3. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@internship.com' },
    update: { password: adminPassword },
    create: {
      name: 'System Administrator',
      email: 'admin@internship.com',
      password: adminPassword,
      roleId: adminRole.id,
    },
  });
  console.log('Admin user created/verified: admin@internship.com / admin123');

  // 4. Create Mentor User
  const mentorPassword = await bcrypt.hash('mentor123', 10);
  await prisma.user.upsert({
    where: { email: 'mentor@internship.com' },
    update: { password: mentorPassword },
    create: {
      name: 'Senior Mentor',
      email: 'mentor@internship.com',
      password: mentorPassword,
      roleId: mentorRole.id,
    },
  });
  console.log('Mentor user created/verified: mentor@internship.com / mentor123');

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
