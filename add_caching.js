const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'backend', 'src', 'routes');

const routeFiles = [
  { file: 'galleryRoutes.js', prefix: '/api/gallery' },
  { file: 'projectRoutes.js', prefix: '/api/projects' },
  { file: 'causeRoutes.js', prefix: '/api/causes' },
  { file: 'mediaRoutes.js', prefix: '/api/media' },
  { file: 'announcementRoutes.js', prefix: '/api/announcements' },
  { file: 'testimonialRoutes.js', prefix: '/api/testimonials' },
  { file: 'settingsRoutes.js', prefix: '/api/settings' }
];

for (const { file, prefix } of routeFiles) {
  const filePath = path.join(routesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('cacheMiddleware')) {
    console.log(`Already cached: ${file}`);
    continue;
  }
  
  // Add import
  const importStatement = `import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';\n`;
  content = importStatement + content;
  
  // Replace router.get('/',
  content = content.replace(/router\.get\('\/',\s*/, `router.get('/', cacheMiddleware(300), `);
  
  // Replace POST, PUT, DELETE to include clearCache
  content = content.replace(/router\.post\('([^']+)',\s*(requireAuth,\s*)?/g, `router.post('$1', $2clearCache('${prefix}'), `);
  content = content.replace(/router\.put\('([^']+)',\s*(requireAuth,\s*)?/g, `router.put('$1', $2clearCache('${prefix}'), `);
  content = content.replace(/router\.delete\('([^']+)',\s*(requireAuth,\s*)?/g, `router.delete('$1', $2clearCache('${prefix}'), `);
  
  // For routes that don't have requireAuth on post (like settings maybe?), the regex $2 captures it if present.
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
