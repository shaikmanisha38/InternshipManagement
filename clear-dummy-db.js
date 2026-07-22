const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const safeDelete = async (modelName) => {
      try {
        if (prisma[modelName]) {
          const res = await prisma[modelName].deleteMany({});
          console.log(`Deleted ${res.count} records from ${modelName}`);
        }
      } catch (e) {
        console.log(`Skipped ${modelName}: ${e.message}`);
      }
    };

    console.log('Wiping dummy database data (keeping roles and users)...');

    // We do NOT want to wipe User or Role.
    // We only want to wipe:
    await safeDelete('internshipApplication');
    await safeDelete('studentInternship');
    await safeDelete('roadmap');
    await safeDelete('resource');
    await safeDelete('module');
    await safeDelete('submission');
    await safeDelete('taskSubmission');
    await safeDelete('assessmentSubmission');
    await safeDelete('task');
    await safeDelete('assessment');
    await safeDelete('attendance');
    await safeDelete('certificate');
    await safeDelete('studentBadge');
    await safeDelete('githubAccount');
    await safeDelete('leaderboard');
    await safeDelete('notification');
    await safeDelete('activityLog');
    
    // Wipe internships last because they might have foreign keys pointing to them
    await safeDelete('internship');

    console.log('Database dummy data wiped successfully!');

  } catch (error) {
    console.error("Error wiping database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
