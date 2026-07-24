const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding internships...");

  // 1. Ensure we have a mentor to assign to the internships
  let mentor = await prisma.user.findFirst({
    where: { role: { roleName: 'MENTOR' } }
  });

  if (!mentor) {
    // Attempt to find any user just in case, or we leave mentor null
    console.log("No mentor found, assigning to first admin");
    mentor = await prisma.user.findFirst({
        where: { role: { roleName: 'ADMIN' } }
    });
  }

  // --- INTERNSHIP 1: Full Stack React & Supabase ---
  const internship1 = await prisma.internship.create({
    data: {
      title: "Full Stack Web Development: React & Supabase (60 Days)",
      description: "Take beginners from basic understanding to deploying a functional, database-driven web application. Learn React, Supabase, Git, and deployment over a comprehensive 60-day curriculum.",
      duration: "60 Days",
      technology: "React, Supabase, Node.js, Vercel",
      difficulty: "Intermediate",
      maxCapacity: 100,
      status: "OPEN",
      mentorId: mentor ? mentor.id : null,
      companyName: "National Tech",
      techStack: ["React", "JavaScript", "Supabase", "Git"]
    }
  });

  console.log(`Created Internship 1: ${internship1.id}`);

  // We need to create 9 weeks (approx 60 days)
  let currentDay = 1;
  for (let week = 1; week <= 9; week++) {
    const roadmap = await prisma.roadmap.create({
      data: {
        internshipId: internship1.id,
        weekNumber: week,
        title: `Week ${week}`,
        description: `Learning objectives for Week ${week}`,
        totalDays: week === 9 ? 4 : 7, // 8 weeks * 7 = 56, + 4 = 60 days
      }
    });

    const daysInWeek = week === 9 ? 4 : 7;
    for (let dayOfWeek = 1; dayOfWeek <= daysInWeek; dayOfWeek++) {
      let title = `Day ${currentDay} Activity`;
      let topicsCovered = ["General Learning"];
      
      // Map the 45-day plan to the first 45 days
      if (currentDay === 1) { title = "The Dev Environment & Web Basics"; topicsCovered = ["Node.js", "VS Code", "Git"]; }
      else if (currentDay === 2) { title = "Modern JavaScript Refresher"; topicsCovered = ["ES6+", "Arrow Functions"]; }
      else if (currentDay === 3) { title = "Crucial Array Methods for React"; topicsCovered = [".map()", ".filter()"]; }
      else if (currentDay === 4) { title = "Git & Local Version Control"; topicsCovered = ["Commits", "Branches"]; }
      else if (currentDay === 5) { title = "GitHub & Remote Collaboration"; topicsCovered = ["Push", "Pull Requests"]; }
      else if (currentDay === 6) { title = "React Mental Model & Vite Setup"; topicsCovered = ["Virtual DOM", "Vite"]; }
      else if (currentDay >= 7 && currentDay <= 15) { title = `React Core Concepts - Part ${currentDay - 6}`; topicsCovered = ["Components", "Props", "State"]; }
      else if (currentDay >= 16 && currentDay <= 20) { title = `Routing & Side Effects - Part ${currentDay - 15}`; topicsCovered = ["useEffect", "React Router"]; }
      else if (currentDay >= 21 && currentDay <= 25) { title = `Backend with Supabase - Part ${currentDay - 20}`; topicsCovered = ["BaaS", "Authentication"]; }
      else if (currentDay >= 26 && currentDay <= 40) { title = `Guided Project Build - Part ${currentDay - 25}`; topicsCovered = ["Project Management", "UI/UX"]; }
      else if (currentDay >= 41 && currentDay <= 45) { title = `Deployment & Wrap-up - Part ${currentDay - 40}`; topicsCovered = ["Vercel", "Testing"]; }
      else if (currentDay >= 46 && currentDay <= 60) { title = `Capstone Project Phase - Day ${currentDay - 45}`; topicsCovered = ["Independent Work", "Code Review"]; }

      const rDay = await prisma.roadmapDay.create({
        data: {
          roadmapId: roadmap.id,
          dayNumber: currentDay,
          title: title,
          topicsCovered: topicsCovered
        }
      });

      // Create a task for this day
      await prisma.task.create({
        data: {
          roadmapDayId: rDay.id,
          title: `Assignment for ${title}`,
          description: `Complete the daily assignment focused on ${topicsCovered.join(", ")}. Ensure you push your code to GitHub.`,
          difficulty: "Medium",
          estimatedTime: "2 Hours",
          unlockOrder: currentDay
        }
      });

      currentDay++;
    }
  }


  // --- INTERNSHIP 2: Backend Developer (Node.js & Postgres) ---
  const internship2 = await prisma.internship.create({
    data: {
      title: "Backend Development: Node.js & Advanced Postgres (60 Days)",
      description: "Master server-side programming, creating robust REST APIs, testing, and complex database relationships in a 60-day intensive pipeline.",
      duration: "60 Days",
      technology: "Node.js, Express, PostgreSQL, Jest",
      difficulty: "Advanced",
      maxCapacity: 50,
      status: "OPEN",
      mentorId: mentor ? mentor.id : null,
      companyName: "Backend Builders Inc",
      techStack: ["Node.js", "Express", "PostgreSQL", "Docker"]
    }
  });

  console.log(`Created Internship 2: ${internship2.id}`);

  let currentDay2 = 1;
  for (let week = 1; week <= 9; week++) {
    const roadmap = await prisma.roadmap.create({
      data: {
        internshipId: internship2.id,
        weekNumber: week,
        title: `Week ${week}`,
        description: `Backend Architecture Week ${week}`,
        totalDays: week === 9 ? 4 : 7,
      }
    });

    const daysInWeek = week === 9 ? 4 : 7;
    for (let dayOfWeek = 1; dayOfWeek <= daysInWeek; dayOfWeek++) {
      const rDay = await prisma.roadmapDay.create({
        data: {
          roadmapId: roadmap.id,
          dayNumber: currentDay2,
          title: `Backend Day ${currentDay2}`,
          topicsCovered: ["API Design", "Database Modeling"]
        }
      });

      await prisma.task.create({
        data: {
          roadmapDayId: rDay.id,
          title: `Backend Challenge ${currentDay2}`,
          description: `Write the server code and database queries for today's assignment.`,
          difficulty: "Hard",
          estimatedTime: "3 Hours",
          unlockOrder: currentDay2
        }
      });

      currentDay2++;
    }
  }

  console.log("Database successfully seeded with 60-day internships!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
