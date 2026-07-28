import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Weekly Assessments based on Roadmap topics...');

  // Optional: clear existing assessments
  await prisma.assessment.deleteMany({});
  console.log('Cleared existing assessments.');

  // Fetch all roadmaps with their days
  const roadmaps = await prisma.roadmap.findMany({
    include: {
      roadmapDays: true
    }
  });

  if (roadmaps.length === 0) {
    console.log('No roadmaps found. Run seed-60-days.ts first.');
    return;
  }

  // To prevent creating duplicate assessments for different internships but same week content,
  // The Assessment model has `week` Int, but no `internshipId`.
  // We will just create 12 assessments, one for each week (1-12).
  
  const createdWeeks = new Set();

  for (const roadmap of roadmaps) {
    const week = roadmap.weekNumber;
    
    if (createdWeeks.has(week)) {
      continue; // already created an assessment for this week number
    }

    // Gather all topics from this week's days
    const allTopics = new Set<string>();
    for (const day of roadmap.roadmapDays) {
      if (day.topicsCovered && Array.isArray(day.topicsCovered)) {
        day.topicsCovered.forEach((topic: any) => allTopics.add(topic));
      }
    }
    
    const topicsList = Array.from(allTopics);
    
    if (topicsList.length === 0) {
      topicsList.push('General Concepts');
    }

    const assessment = await prisma.assessment.create({
      data: {
        week: week,
        title: `Week ${week} Assessment: ${roadmap.title}`,
        description: `Evaluate your knowledge on: ${topicsList.join(', ')}.`,
        passingScore: 70,
        timeLimit: 30,
        totalQuestions: 10
      }
    });

    console.log(`Created Assessment for Week ${week} (ID: ${assessment.id})`);

    // Create 10 questions for this assessment
    // Distribute questions across the topics
    for (let i = 0; i < 10; i++) {
      const topic = topicsList[i % topicsList.length];
      
      const options = [
        `Correct application of ${topic}`,
        `Incorrect usage of ${topic}`,
        `An unrelated concept to ${topic}`,
        `None of the above`
      ];

      await prisma.assessmentQuestion.create({
        data: {
          assessmentId: assessment.id,
          questionText: `Which of the following best describes a key principle of ${topic}?`,
          type: 'MCQ',
          options: options,
          correctAnswer: options[0],
          points: 10
        }
      });
    }
    
    createdWeeks.add(week);
  }

  console.log('Weekly Assessment seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
