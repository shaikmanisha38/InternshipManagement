const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roadmaps...');

  // Find all open internships
  const internships = await prisma.internship.findMany({
    where: { status: 'OPEN' }
  });

  if (internships.length === 0) {
    console.log('No internships found to seed roadmaps.');
    return;
  }

  for (const internship of internships) {
    // Check if roadmap already exists
    const existing = await prisma.roadmap.findFirst({
      where: { internshipId: internship.id }
    });
    if (existing) {
      console.log(`Roadmap already exists for internship: ${internship.title}`);
      continue;
    }

    // Create Week 1 Roadmap
    const week1 = await prisma.roadmap.create({
      data: {
        internshipId: internship.id,
        weekNumber: 1,
        title: 'Foundations & Environment Setup',
        description: 'Get familiar with the tools, IDE, and core technologies required for the internship.',
        totalDays: 5
      }
    });

    // Create 5 days for Week 1
    for (let day = 1; day <= 5; day++) {
      await prisma.roadmapDay.create({
        data: {
          roadmapId: week1.id,
          dayNumber: day,
          title: `Day ${day} Overview`,
          topicsCovered: ['Introduction', 'Setup', 'Basic Syntax'],
          tasks: {
            create: [
              {
                title: `Complete Day ${day} Assessment`,
                description: `Read the materials and complete the coding assessment for day ${day}.`,
                difficulty: 'Beginner',
                estimatedTime: '2 hours',
                unlockOrder: 1
              }
            ]
          }
        }
      });
    }

    // Create Week 2 Roadmap
    const week2 = await prisma.roadmap.create({
      data: {
        internshipId: internship.id,
        weekNumber: 2,
        title: 'Core Concepts & Advanced Syntax',
        description: 'Dive deeper into the language features and build your first small project.',
        totalDays: 5
      }
    });

    for (let day = 1; day <= 5; day++) {
      await prisma.roadmapDay.create({
        data: {
          roadmapId: week2.id,
          dayNumber: day,
          title: `Day ${day} Deep Dive`,
          topicsCovered: ['Advanced Topics', 'Project Work'],
          tasks: {
            create: [
              {
                title: `Day ${day} Mini-Project`,
                description: `Apply what you learned to build a small feature.`,
                difficulty: 'Intermediate',
                estimatedTime: '3 hours',
                unlockOrder: 1
              }
            ]
          }
        }
      });
    }

    console.log(`Created 2 weeks of roadmaps for: ${internship.title}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
