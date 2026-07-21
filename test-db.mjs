import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const userId = "temp"; // Just a dummy ID for testing query syntax
    const whereClause = {
      internship: { mentorId: userId }
    };
    
    console.log('Testing prisma query...');
    const studentInternships = await prisma.studentInternship.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            attendance: { select: { status: true } },
            taskSubmissions: {
              select: {
                aiEvaluation: { select: { score: true } }
              }
            },
            githubAccount: { select: { username: true } }
          }
        }
      }
    });
    console.log('Query successful! Count:', studentInternships.length);
  } catch (error) {
    console.error('Prisma query failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
