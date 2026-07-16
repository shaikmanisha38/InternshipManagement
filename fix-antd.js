const fs = require('fs');
const path = require('path');

const dir = 'components/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix Alert message="Error" -> title="Error"
  if (content.includes('<Alert') && content.includes('message=')) {
    content = content.replace(/<Alert([^>]*?)message=/g, '<Alert$1title=');
    changed = true;
  }

  // Fix Card bodyStyle={{ ... }} -> styles={{ body: { ... } }}
  if (content.includes('bodyStyle=')) {
    content = content.replace(/bodyStyle=\{([^}]+?)\}/g, 'styles={{ body: $1 }}');
    changed = true;
  }

  // Fix Card headStyle={{ ... }} -> styles={{ header: { ... } }}
  // Wait, if a card has BOTH bodyStyle and headStyle, the regex will create two styles={{}} props which is an error in React!
  // It's safer to just change it to use styles={{ header: ... }}
  // Let's do it correctly:
  if (content.includes('headStyle=')) {
    // If it already has styles={{ body: ... }}, this is harder to regex.
    // Let's check if any file has both:
  }
}
