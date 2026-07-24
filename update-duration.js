const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const internships = await prisma.internship.findMany({
    where: {
      title: {
        contains: '60 Days'
      }
    }
  });

  let updatedCount = 0;
  for (const internship of internships) {
    const newTitle = internship.title.replace('60 Days', '12 Weeks');
    const newDescription = internship.description.replace(/60-day/g, '12-week').replace(/60 days/g, '12 weeks').replace(/60 Days/g, '12 Weeks');
    const newDuration = internship.duration.replace('60 Days', '12 Weeks');
    
    await prisma.internship.update({
      where: { id: internship.id },
      data: {
        title: newTitle,
        description: newDescription,
        duration: newDuration
      }
    });
    updatedCount++;
  }

  console.log(`Updated ${updatedCount} internships from '60 Days' to '12 Weeks'!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
