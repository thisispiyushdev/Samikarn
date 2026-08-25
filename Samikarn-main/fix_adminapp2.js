import fs from 'fs';

const file = './frontend/src/admin/AdminApp.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/`([A-Z]+)'/g, "'$1'");

fs.writeFileSync(file, content);
console.log("Fixed AdminApp.jsx again");
