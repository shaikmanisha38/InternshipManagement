const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if ((content.includes('useState') || content.includes('useEffect') || content.includes('useRef') || content.includes('useContext') || content.includes('useCallback') || content.includes('useMemo') || content.includes('useReducer')) && !content.includes('"use client"')) {
        console.log('Adding "use client" to ' + fullPath);
        fs.writeFileSync(fullPath, '"use client";\n' + content);
      }
    }
  }
}

processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'app'));
console.log('Done');
