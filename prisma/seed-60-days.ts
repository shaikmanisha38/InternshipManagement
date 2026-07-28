const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export {};
const curriculum = require('./curriculum-data.js');

async function main() {
  console.log('Seeding detailed 60-day roadmap (12 weeks x 5 days)...');

  // Find all open internships
  const internships = await prisma.internship.findMany({
    where: { status: 'OPEN' }
  });

  if (internships.length === 0) {
    console.log('No OPEN internships found. Fetching all internships...');
    const allInternships = await prisma.internship.findMany();
    if (allInternships.length === 0) {
      console.log('No internships found to seed roadmaps.');
      return;
    }
    internships.push(...allInternships);
  }

  // De-duplicate internships in case we fetched all after OPEN
  const uniqueInternships = Array.from(new Map(internships.map((item: any) => [item.id, item])).values());

  for (const internship of uniqueInternships as any[]) {
    // Delete existing roadmaps for this internship
    await prisma.roadmap.deleteMany({
      where: { internshipId: internship.id }
    });
    console.log(`Deleted existing roadmaps for: ${internship.title}`);

    for (let w = 0; w < 12; w++) {
      const weekData = curriculum[w];
      
      const roadmap = await prisma.roadmap.create({
        data: {
          internshipId: internship.id,
          weekNumber: weekData.weekNumber,
          title: weekData.title,
          description: weekData.description,
          totalDays: 5
        }
      });

      for (const day of weekData.days) {
        await prisma.roadmapDay.create({
          data: {
            roadmapId: roadmap.id,
            dayNumber: day.day,
            title: day.title,
            topicsCovered: day.topics,
            tasks: {
              create: [
                {
                  title: `Task: ${day.title}`,
                  description: day.desc,
                  difficulty: weekData.weekNumber > 8 ? 'Advanced' : (weekData.weekNumber > 4 ? 'Intermediate' : 'Beginner'),
                  estimatedTime: '2-3 hours',
                  unlockOrder: 1,
                  resourceLinks: day.resources
                }
              ]
            }
          }
        });
      }
    }
    
    console.log(`Created detailed 60-day roadmap for: ${internship.title}`);
  }

  console.log('Detailed 60-day roadmap seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
