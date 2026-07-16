const fs = require('fs');
const path = require('path');

const dirs = ['components/pages', 'components/layouts', 'components/common'];

let totalChanges = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Alert message -> title
    content = content.replace(/<Alert([^>]*?)\bmessage=/g, '<Alert$1title=');

    // 2. Timeline items.children -> items.content
    // Example: children: (...) -> content: (...)
    // This is trickier. It's usually inside an items.map() or items array.
    // Let's just look for `children:` inside Timeline items.
    if (content.includes('Timeline') && content.includes('children:')) {
       // Since children is a generic prop, we only replace it where it's building Timeline items.
       // E.g., `children: (` inside Timeline map
       content = content.replace(/children:\s*\(/g, 'content: (');
       content = content.replace(/children:\s*</g, 'content: <');
    }

    // 3. Card bodyStyle and headStyle
    // To handle Cards that have both bodyStyle and headStyle gracefully without creating two `styles` props:
    // We can replace `<Card ...>` by extracting bodyStyle and headStyle.
    
    content = content.replace(/<Card([^>]+)>/g, (match, cardProps) => {
      let hasBody = cardProps.includes('bodyStyle=');
      let hasHead = cardProps.includes('headStyle=');
      
      if (!hasBody && !hasHead) return match;

      let stylesObj = [];
      
      let newProps = cardProps;
      if (hasBody) {
        newProps = newProps.replace(/bodyStyle=\{\{([^}]+)\}\}/, (m, bodyContent) => {
          stylesObj.push(`body: {${bodyContent}}`);
          return '';
        });
      }
      
      if (hasHead) {
        newProps = newProps.replace(/headStyle=\{\{([^}]+)\}\}/, (m, headContent) => {
          stylesObj.push(`header: {${headContent}}`);
          return '';
        });
      }
      
      // Cleanup double spaces
      newProps = newProps.replace(/\s+/g, ' ');
      
      return `<Card${newProps} styles={{ ${stylesObj.join(', ')} }}>`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
      totalChanges++;
    }
  }
}

console.log(`Done. Updated ${totalChanges} files.`);
