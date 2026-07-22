import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const mentorRole = await prisma.role.findFirst({ where: { roleName: 'MENTOR' } });
    if (!mentorRole) throw new Error("Mentor role not found");
    const mentors = await prisma.user.findMany({ where: { roleId: mentorRole.id } });
    console.log(`Found ${mentors.length} mentors.`);

    const studentRole = await prisma.role.findFirst({ where: { roleName: 'STUDENT' } });
    if (!studentRole) throw new Error("Student role not found");
    let student = await prisma.user.findFirst({ where: { roleId: studentRole.id } });
    if (!student) {
        student = await prisma.user.create({
            data: { name: "Test Student", email: "test.student@example.com", password: "pwd", roleId: studentRole.id, department: "CS" }
        });
    }

    for (const mentor of mentors) {
        let internship = await prisma.internship.findFirst({ where: { mentorId: mentor.id } });
        if (!internship) {
            internship = await prisma.internship.create({
                data: { title: "Mock Internship", duration: "3m", description: "desc", technology: "tech", difficulty: "mid", mentorId: mentor.id, status: "OPEN" }
            });
        }
        
        const existing = await prisma.enrollment.findFirst({
            where: { studentId: student.id, internshipId: internship.id }
        });

        if (!existing) {
            await prisma.enrollment.create({
                data: { studentId: student.id, internshipId: internship.id, mentorId: mentor.id, status: 'PENDING' }
            });
        } else {
            await prisma.enrollment.update({
                where: { id: existing.id },
                data: { status: 'PENDING' }
            });
        }
        console.log(`Created/Updated pending request for mentor: ${mentor.email}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
