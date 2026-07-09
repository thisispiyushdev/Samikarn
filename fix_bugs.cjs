const fs = require('fs');

function fixAdminApp() {
  const file = "C:/Users/Vivek/Downloads/VIvek's Work/cool_projects/samikarn/frontend/src/admin/AdminApp.jsx";
  let content = fs.readFileSync(file, 'utf8');

  // Remove the 2MB limit check everywhere
  content = content.replace(/if\s*\(\s*file\.size\s*>\s*2000000\s*\)\s*return\s*showToast\([^)]+\);\n?\s*/g, '');

  // Fix the setForm closure issue
  content = content.replace(/setForm\(\{\.\.\.form,\s*([a-zA-Z0-9_]+)\s*:\s*base64\}\)/g, 'setForm(prev => ({...prev, $1: base64}))');

  fs.writeFileSync(file, content);
  console.log('Fixed AdminApp.jsx');
}

function fixHome() {
  const file = "C:/Users/Vivek/Downloads/VIvek's Work/cool_projects/samikarn/frontend/src/pages/Home.jsx";
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    'const allImages = selectedEvent ? [selectedEvent.mainImage, ...(selectedEvent.gallery || [])] : [];',
    'const allImages = selectedEvent ? [selectedEvent.mainImage || selectedEvent.image, ...(selectedEvent.gallery || [])].filter(Boolean) : [];'
  );

  fs.writeFileSync(file, content);
  console.log('Fixed Home.jsx');
}

fixAdminApp();
fixHome();
