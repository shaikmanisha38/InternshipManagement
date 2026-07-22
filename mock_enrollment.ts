import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Find a mentor
    const mentorRole = await prisma.role.findFirst({ where: { roleName: 'MENTOR' } });
    if (!mentorRole) throw new Error("No MENTOR role found");
    const mentor = await prisma.user.findFirst({ where: { roleId: mentorRole.id } });
    if (!mentor) throw new Error("No mentors found in DB");

    // 2. Find a student
    const studentRole = await prisma.role.findFirst({ where: { roleName: 'STUDENT' } });
    if (!studentRole) throw new Error("No STUDENT role found");
    let student = await prisma.user.findFirst({ where: { roleId: studentRole.id } });
    
    // Create a student if one doesn't exist
    if (!student) {
        student = await prisma.user.create({
            data: {
                name: "Test Student",
                email: "test.student@example.com",
                password: "password123", // normally hashed, but just for test
                roleId: studentRole.id,
                department: "Computer Science"
            }
        });
    }

    // 3. Find or create an internship assigned to this mentor
    let internship = await prisma.internship.findFirst({ where: { mentorId: mentor.id } });
    if (!internship) {
      internship = await prisma.internship.create({
        data: {
          title: "Mock AI/ML Internship",
          description: "Learn AI and ML",
          duration: "3 months",
          technology: "Python, TensorFlow",
          difficulty: "Intermediate",
          mentorId: mentor.id,
          status: "OPEN"
        }
      });
    }

    // 4. Create pending enrollment
    const existing = await prisma.enrollment.findFirst({
      where: { studentId: student.id, internshipId: internship.id }
    });

    if (!existing) {
      const newEnrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          internshipId: internship.id,
          mentorId: mentor.id,
          status: 'PENDING'
        }
      });
      console.log("SUCCESS! Created mock enrollment:", newEnrollment.id);
    } else {
        // Force it to pending again if it was approved/rejected
        await prisma.enrollment.update({
            where: { id: existing.id },
            data: { status: 'PENDING' }
        });
      console.log("Mock enrollment was already there, forced it back to PENDING:", existing.id);
    }
  } catch (e) {
    console.error("Error creating mock data:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
