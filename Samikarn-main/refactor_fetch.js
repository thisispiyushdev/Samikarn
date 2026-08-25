import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./frontend/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace fetch('/api/...
  if (content.includes("fetch('/api/")) {
    content = content.replace(/fetch\('\/api\//g, 'fetch(`${import.meta.env.VITE_API_BASE_URL || \'\'}/api/');
    changed = true;
  }
  
  // Replace const apiBase = ''; in AdminApp
  if (content.includes("const apiBase = '';")) {
    content = content.replace("const apiBase = '';", "const apiBase = import.meta.env.VITE_API_BASE_URL || '';");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
