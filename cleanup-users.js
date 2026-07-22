const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Find the admin role
    const adminRole = await prisma.role.findUnique({
      where: { roleName: 'ADMIN' }
    });

    if (!adminRole) {
      console.error("Admin role not found!");
      return;
    }

    // 2. Find users who are NOT admins
    const nonAdminUsers = await prisma.user.findMany({
      where: {
        roleId: {
          not: adminRole.id
        }
      }
    });

    console.log(`Found ${nonAdminUsers.length} non-admin users to delete.`);

    if (nonAdminUsers.length === 0) {
      console.log("No non-admin users to delete.");
      return;
    }

    const nonAdminUserIds = nonAdminUsers.map(u => u.id);

    // Helper to safely delete
    const safeDelete = async (modelName, whereClause) => {
      try {
        if (prisma[modelName]) {
          const res = await prisma[modelName].deleteMany({ where: whereClause });
          console.log(`Deleted ${res.count} from ${modelName}.`);
        }
      } catch (e) {
        console.log(`Skipped ${modelName} (table might not exist or error): ${e.message}`);
      }
    };

    // 3. Delete dependent records first to avoid foreign key constraint errors
    await safeDelete('internshipApplication', { studentId: { in: nonAdminUserIds } });
    await safeDelete('studentInternship', { studentId: { in: nonAdminUserIds } });
    await safeDelete('taskSubmission', { studentId: { in: nonAdminUserIds } });
    await safeDelete('assessmentSubmission', { studentId: { in: nonAdminUserIds } });
    await safeDelete('attendance', { studentId: { in: nonAdminUserIds } });
    await safeDelete('certificate', { studentId: { in: nonAdminUserIds } });
    await safeDelete('studentBadge', { studentId: { in: nonAdminUserIds } });
    await safeDelete('githubAccount', { userId: { in: nonAdminUserIds } });
    await safeDelete('leaderboard', { userId: { in: nonAdminUserIds } });
    await safeDelete('notification', { userId: { in: nonAdminUserIds } });
    await safeDelete('activityLog', { userId: { in: nonAdminUserIds } });

    // 4. Finally, delete the users
    const delUsers = await prisma.user.deleteMany({
      where: {
        id: { in: nonAdminUserIds }
      }
    });
    console.log(`Successfully deleted ${delUsers.count} non-admin users.`);

  } catch (error) {
    console.error("Error cleaning up database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
