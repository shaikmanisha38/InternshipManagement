const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components', 'pages');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Admin') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex to find `const data = [ ... ];`
  // We want to replace it with `const data = [];`
  const newDataRegex = /const\s+data\s*=\s*\[[\s\S]*?\];/;
  
  if (newDataRegex.test(content)) {
    content = content.replace(newDataRegex, 'const data = [];');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Cleared dummy data in ${file}`);
  }
});

// AdminDashboard also has dummy charts
const dashboardPath = path.join(dir, 'AdminDashboard.jsx');
let dashContent = fs.readFileSync(dashboardPath, 'utf-8');
const barDataRegex = /const\s+barData\s*=\s*\[[\s\S]*?\];/;
if (barDataRegex.test(dashContent)) {
  dashContent = dashContent.replace(barDataRegex, 'const barData = [];');
}
const pieDataRegex = /const\s+pieData\s*=\s*\[[\s\S]*?\];/;
if (pieDataRegex.test(dashContent)) {
  dashContent = dashContent.replace(pieDataRegex, 'const pieData = [];');
}
const lineDataRegex = /const\s+lineData\s*=\s*\[[\s\S]*?\];/;
if (lineDataRegex.test(dashContent)) {
  dashContent = dashContent.replace(lineDataRegex, 'const lineData = [];');
}
const areaDataRegex = /const\s+areaData\s*=\s*\[[\s\S]*?\];/;
if (areaDataRegex.test(dashContent)) {
  dashContent = dashContent.replace(areaDataRegex, 'const areaData = [];');
}
fs.writeFileSync(dashboardPath, dashContent, 'utf-8');
console.log(`Cleared dummy chart data in AdminDashboard.jsx`);
