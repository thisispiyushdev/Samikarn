const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const mediaDir = path.join(__dirname, 'frontend', 'src', 'assets', 'media');
const publicDir = path.join(__dirname, 'frontend', 'public');

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const imagesToProcess = [
  { type: 'local', path: path.join(mediaDir, '1.png.png'), name: 'logo.webp' },
  { type: 'local', path: path.join(mediaDir, 'about_image.png'), name: 'about_image.webp' },
  { type: 'local', path: path.join(publicDir, 'logo.png'), name: 'logo.webp', outDir: publicDir },
  { type: 'url', url: 'https://i.ibb.co/KHtZ7g2/image-2026-07-05-170637002.png', name: 'hero_bg.webp' },
  { type: 'url', url: 'https://i.ibb.co/qXrvb6v/IMG-8797.jpg', name: 'about_story1.webp' },
  { type: 'url', url: 'https://i.ibb.co/jPkyZtvC/Untitled-design.png', name: 'about_story2.webp' },
];

const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', (err) => { fs.unlink(dest, () => reject(err)); });
    }).on('error', reject);
  });
};

async function processImages() {
  for (const img of imagesToProcess) {
    const outDir = img.outDir || mediaDir;
    const outPath = path.join(outDir, img.name);
    
    try {
      if (img.type === 'url') {
        const tempPath = path.join(mediaDir, 'temp_' + img.name);
        console.log(`Downloading ${img.url}...`);
        await downloadImage(img.url, tempPath);
        console.log(`Converting ${img.name}...`);
        await sharp(tempPath).webp({ quality: 80 }).toFile(outPath);
        fs.unlinkSync(tempPath);
      } else if (img.type === 'local') {
        if (fs.existsSync(img.path)) {
            console.log(`Converting local ${img.path}...`);
            await sharp(img.path).webp({ quality: 80 }).toFile(outPath);
        } else {
            console.log(`Local file not found: ${img.path}`);
        }
      }
      console.log(`Created ${outPath}`);
    } catch (e) {
      console.error(`Error processing ${img.name}:`, e);
    }
  }
}

processImages().then(() => console.log('All done!'));
