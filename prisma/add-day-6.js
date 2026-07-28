const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, 'curriculum-data.js');

try {
  let curriculum = require('./curriculum-data.js');
  
  curriculum = curriculum.map(week => {
    // Check if day 6 already exists
    const hasDay6 = week.days.some(d => d.day === 6);
    if (!hasDay6) {
      week.days.push({
        day: 6,
        title: 'Weekly Review & Mini-Project Refinement',
        topics: ['Review', 'Bug Fixing', 'Code Optimization'],
        desc: 'Review all concepts learned this week and refine your mini-project. Prepare for tomorrow\'s assessment.',
        resources: [{ title: 'Refactoring Best Practices', url: 'https://refactoring.guru/refactoring', type: 'Guide' }]
      });
    }
    return week;
  });

  const fileContent = `const curriculum = ${JSON.stringify(curriculum, null, 2)};\n\nmodule.exports = curriculum;\n`;
  
  fs.writeFileSync(curriculumPath, fileContent, 'utf8');
  console.log('Successfully updated curriculum-data.js with Day 6!');
} catch (e) {
  console.error('Error updating curriculum:', e);
}
