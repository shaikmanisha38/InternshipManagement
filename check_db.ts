import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const studentInternships = await prisma.studentInternship.findMany({
        include: { student: true, internship: true }
    });
    console.log("Student Internships in DB:");
    studentInternships.forEach(si => {
        console.log(`- Student: ${si.student.email}, Internship: ${si.internship.title}, Status: ${si.status}`);
    });
    
    if (studentInternships.length === 0) {
        console.log("No student internships found in DB.");
    }
    
    const enrollments = await prisma.enrollment.findMany({
        include: { student: true }
    });
    console.log("\nEnrollments in DB:");
    enrollments.forEach(e => {
        console.log(`- Student: ${e.student.email}, Status: ${e.status}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
