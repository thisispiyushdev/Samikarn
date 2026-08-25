import fs from 'fs';

const file = './frontend/src/admin/AdminApp.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/showToast\(`/g, "showToast('");

fs.writeFileSync(file, content);
console.log("Fixed showToast syntax in AdminApp.jsx");
