const fs = require('fs');
const path = require('path');

const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
      let content = fs.readFileSync(srcPath, 'utf8');
      
      // Basic React Router replacements
      content = content.replace(/import .* from 'react-router-dom';/g, (match) => {
        let imports = [];
        if (match.includes('useNavigate')) imports.push('useRouter');
        if (match.includes('useLocation')) imports.push('usePathname');
        
        let newImport = '';
        if (imports.length > 0) {
          newImport += `import { ${imports.join(', ')} } from 'next/navigation';\n`;
        }
        if (match.includes('Link') || match.includes('NavLink')) {
          newImport += `import Link from 'next/link';\n`;
        }
        return newImport;
      });

      content = content.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
      content = content.replace(/navigate\(/g, 'router.push(');
      
      content = content.replace(/const location = useLocation\(\);/g, 'const pathname = usePathname();');
      content = content.replace(/location\.pathname/g, 'pathname');

      content = content.replace(/<NavLink/g, '<Link');
      content = content.replace(/<\/NavLink>/g, '</Link>');
      content = content.replace(/ to={/g, ' href={');
      content = content.replace(/ to="/g, ' href="');
      
      // Outlet is a bit tricky, replace with {children} in Layouts
      content = content.replace(/<Outlet \/>/g, '{children}');
      if (entry.name === 'DashboardLayout.jsx') {
        content = content.replace(/export default function DashboardLayout\(\{ role = 'student' \}\) {/, 'export default function DashboardLayout({ role = "student", children }) {');
      }

      // Add "use client" if it has hooks
      if (content.includes('useState') || content.includes('useEffect') || content.includes('useRouter') || content.includes('usePathname')) {
        content = '"use client";\n' + content;
      }

      fs.writeFileSync(destPath, content);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

copyDir('./legacy_frontend/src/pages', './components/pages');
copyDir('./legacy_frontend/src/layouts', './components/layouts');
copyDir('./legacy_frontend/src/components', './components/common');
console.log('Migration complete');
