import fs from 'fs';

const file = './frontend/src/admin/AdminApp.jsx';
let content = fs.readFileSync(file, 'utf8');

// The broken string pattern is: `[A-Z]+',
// For example: method: `POST', or type: `PROJECT',
// We need to replace it with: method: 'POST', or type: 'PROJECT',

content = content.replace(/`([A-Z]+)',/g, "'$1',");

fs.writeFileSync(file, content);
console.log("Fixed AdminApp.jsx");
