const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const replacements = [
  {
    file: 'admin/AdminApp.jsx',
    replace: "import logo from '../assets/media/1.png.png';",
    with: "import logo from '../assets/media/logo.webp';"
  },
  {
    file: 'components/layout/Navbar.jsx',
    replace: "import logo from '../../assets/media/1.png.png';",
    with: "import logo from '../../assets/media/logo.webp';"
  },
  {
    file: 'components/sections/HeroSection.jsx',
    replace: "const hardcodedImage = \"https://i.ibb.co/KHtZ7g2/image-2026-07-05-170637002.png\";",
    with: "import heroBg from '../../assets/media/hero_bg.webp';\n  const hardcodedImage = heroBg;"
  },
  {
    file: 'pages/Donate.jsx',
    replace: "image: \"/logo.png\", // Using the logo from public folder",
    with: "image: \"/logo.webp\", // Using the logo from public folder"
  },
  {
    file: 'pages/Home.jsx',
    replace: "import aboutImage from '../assets/media/about_image.png';",
    with: "import aboutImage from '../assets/media/about_image.webp';"
  }
];

replacements.forEach(({ file, replace, with: replacement }) => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(replace, replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
