const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'components/pages');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix Alert message -> title
  content = content.replace(/<Alert([^>]*)\bmessage=/g, '<Alert$1title=');

  // Fix Progress trailColor -> railColor
  content = content.replace(/<Progress([^>]*)\btrailColor=/g, '<Progress$1railColor=');

  // Fix Progress strokeWidth -> remove if there's size, else change to size
  content = content.replace(/<Progress([^>]*)>/g, (match) => {
    if (match.includes('strokeWidth=')) {
      if (match.includes('size=')) {
        // Remove strokeWidth if size is already there
        return match.replace(/\s*strokeWidth=\{[^}]+\}/, '');
      } else {
        // Replace strokeWidth with size
        return match.replace(/strokeWidth=/, 'size=');
      }
    }
    return match;
  });

  // Fix Descriptions labelStyle & contentStyle
  // We already fixed Profile.jsx manually, but just in case
  // For other places (if any) it's mostly recharts Tooltip which we IGNORE.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${path.basename(filePath)}`);
  }
}

const files = fs.readdirSync(COMPONENTS_DIR).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));
files.forEach(f => fixFile(path.join(COMPONENTS_DIR, f)));
