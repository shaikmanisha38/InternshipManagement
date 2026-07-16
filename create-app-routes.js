const fs = require('fs');
const path = require('path');

const routes = {
  // Public
  '/': 'LandingPage',
  '/about': 'AboutPage',
  '/signup': 'SignupPage',
  '/login': 'LoginPage',
  
  // Dashboard (Student)
  '/dashboard': 'DashboardHome',
  '/dashboard/internship': 'MyInternship',
  '/dashboard/task': 'TodaysTask',
  '/dashboard/roadmap': 'Roadmap',
  '/dashboard/submission': 'DailySubmission',
  '/dashboard/github': 'GithubIntegration',
  '/dashboard/ai-feedback': 'AIFeedback',
  '/dashboard/assessments': 'Assessment',
  '/dashboard/progress': 'Progress',
  '/dashboard/attendance': 'Attendance',
  '/dashboard/leaderboard': 'Leaderboard',
  '/dashboard/badges': 'Badges',
  '/dashboard/certificates': 'Certificates',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings',

  // Mentor
  '/mentor': 'MentorOverview',
  '/mentor/students': 'MentorStudents',
  '/mentor/projects': 'MentorProjects',
  '/mentor/analytics': 'MentorAnalytics',
  '/mentor/attendance': 'MentorAttendance',
  '/mentor/assessments': 'MentorAssessments',
  '/mentor/leaderboard': 'MentorLeaderboard',
  '/mentor/certificates': 'MentorCertificates',
  '/mentor/reports': 'MentorReports',

  // Admin
  '/admin': 'AdminDashboard'
  // other admin pages are placeholders, we can map them if needed
};

for (const [routePath, componentName] of Object.entries(routes)) {
  let dirPath;
  if (routePath === '/') {
    dirPath = path.join(__dirname, 'app');
  } else {
    dirPath = path.join(__dirname, 'app', routePath);
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let content = `"use client";\n`;
  content += `import ${componentName} from '@/components/pages/${componentName}';\n`;
  if (routePath.startsWith('/dashboard')) {
    content += `import DashboardLayout from '@/components/layouts/DashboardLayout';\n\n`;
    content += `export default function Page() {\n  return (\n    <DashboardLayout role="student">\n      <${componentName} />\n    </DashboardLayout>\n  );\n}\n`;
  } else if (routePath.startsWith('/mentor')) {
    content += `import DashboardLayout from '@/components/layouts/DashboardLayout';\n\n`;
    content += `export default function Page() {\n  return (\n    <DashboardLayout role="mentor">\n      <${componentName} />\n    </DashboardLayout>\n  );\n}\n`;
  } else if (routePath.startsWith('/admin')) {
    content += `import DashboardLayout from '@/components/layouts/DashboardLayout';\n\n`;
    content += `export default function Page() {\n  return (\n    <DashboardLayout role="admin">\n      <${componentName} />\n    </DashboardLayout>\n  );\n}\n`;
  } else {
    content += `\nexport default function Page() {\n  return <${componentName} />;\n}\n`;
  }

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
}
console.log('App routes created');
