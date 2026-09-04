import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateOgCard() {
  const width = 1200;
  const height = 630;

  // 1. Right photo: workshop photo framed crisply with rounded corners
  const imgWidth = 470;
  const imgHeight = 510;
  const cornerRadius = 20;

  const roundedMask = Buffer.from(`
    <svg width="${imgWidth}" height="${imgHeight}">
      <rect x="0" y="0" width="${imgWidth}" height="${imgHeight}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#ffffff"/>
    </svg>
  `);

  // Crop & resize real photo from workshop
  const photoBuffer = await sharp('frontend/src/assets/media/about-home.jpg')
    .resize(imgWidth, imgHeight, { fit: 'cover', position: 'center' })
    .composite([{ input: roundedMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Prepare logo:
  // Original is 522 x 209 (ratio 2.497).
  // Resize to width: 220, height: 88 so it fits strictly and generously inside its area.
  const logoWidth = 220;
  const logoHeight = Math.round(logoWidth * (209 / 522)); // 88px
  const logoBuffer = await sharp('frontend/public/logo.png')
    .resize(logoWidth, logoHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 3. SVG vector background and graphics - Clean, Light Aesthetic
  const svgBackground = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Light warm modern background gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="60%" stop-color="#F9FBF7"/>
          <stop offset="100%" stop-color="#F2F6ED"/>
        </linearGradient>

        <!-- Subtle warm accent glow in top right -->
        <radialGradient id="topWarmGlow" cx="90%" cy="10%" r="50%">
          <stop offset="0%" stop-color="#FADA78" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#FADA78" stop-opacity="0"/>
        </radialGradient>

        <!-- Subtle olive glow in bottom left -->
        <radialGradient id="botGreenGlow" cx="10%" cy="90%" r="45%">
          <stop offset="0%" stop-color="#556B2F" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#556B2F" stop-opacity="0"/>
        </radialGradient>

        <!-- Top brand bar gradient (Olive green to Warm yellow to Accent coral) -->
        <linearGradient id="brandBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#556B2F"/>
          <stop offset="65%" stop-color="#FADA78"/>
          <stop offset="100%" stop-color="#EC5936"/>
        </linearGradient>

        <!-- Soft shadow for right image card -->
        <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#1B2E10" flood-opacity="0.12"/>
        </filter>
      </defs>

      <!-- Base Canvas Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <circle cx="1000" cy="80" r="400" fill="url(#topWarmGlow)"/>
      <circle cx="150" cy="550" r="350" fill="url(#botGreenGlow)"/>

      <!-- Clean Top Brand Colored Stripe -->
      <rect x="0" y="0" width="${width}" height="6" fill="url(#brandBarGrad)"/>

      <!-- Clean Outer Enclosure Border -->
      <rect x="28" y="28" width="1144" height="574" rx="20" fill="none" stroke="#E2EBE0" stroke-width="1.5"/>

      <!-- ================= LEFT COLUMN ================= -->

      <!-- Top Badge Pill -->
      <g transform="translate(68, 62)">
        <rect width="210" height="30" rx="15" fill="#EEF4EA" stroke="#D3E2CD" stroke-width="1"/>
        <circle cx="15" cy="15" r="4" fill="#556B2F"/>
        <text x="28" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D5321" letter-spacing="1.2">SOCIAL INITIATIVE • NGO</text>
      </g>

      <!-- Logo Container Area (Clean, spacious, well contained) -->
      <!-- The logo image will be placed at (68, 108) with size 220x88 -->
      
      <!-- Main Typography / Headline -->
      <text x="68" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="36" font-weight="800" fill="#1C2713" letter-spacing="-0.5">
        Empowering every individual
      </text>
      <text x="68" y="286" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="800" fill="#556B2F" letter-spacing="-0.5">
        to live with purpose, dignity,
      </text>
      <text x="68" y="328" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="800" fill="#556B2F" letter-spacing="-0.5">
        and opportunity.
      </text>

      <!-- Subtext / Description -->
      <text x="68" y="372" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="500" fill="#4B5563">
        Building an able society through communication, confidence,
      </text>
      <text x="68" y="396" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="500" fill="#4B5563">
        and career readiness across schools, colleges, and communities.
      </text>

      <!-- Focus Pillars / Badges (Light clean pills) -->
      <g transform="translate(68, 418)">
        <!-- Education Badge -->
        <rect x="0" y="0" width="136" height="36" rx="18" fill="#F0F6EC" stroke="#CDE0C4" stroke-width="1"/>
        <text x="68" y="23" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#3A5323">📖 Education</text>

        <!-- Livelihoods Badge -->
        <rect x="148" y="0" width="146" height="36" rx="18" fill="#FFF8E7" stroke="#F6E2A9" stroke-width="1"/>
        <text x="221" y="23" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#87670E">💼 Livelihoods</text>

        <!-- Health Badge -->
        <rect x="306" y="0" width="124" height="36" rx="18" fill="#FDF1EE" stroke="#F8CFC6" stroke-width="1"/>
        <text x="368" y="23" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#A8391C">🩺 Health</text>
      </g>

      <!-- Clean Divider -->
      <line x1="68" y1="488" x2="590" y2="488" stroke="#E5ECE2" stroke-width="1.5"/>

      <!-- Bottom Domain & Info Bar -->
      <g transform="translate(68, 514)">
        <!-- Web link badge -->
        <rect x="0" y="0" width="170" height="38" rx="10" fill="#556B2F"/>
        <text x="85" y="24" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">samikaran.org</text>

        <text x="188" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#5A6D47">
          • 80G Certified Non-Profit Organization
        </text>
      </g>

      <!-- ================= RIGHT COLUMN PHOTO CONTAINER ================= -->
      <!-- Drop shadow holder for the photo -->
      <rect x="662" y="60" width="${imgWidth}" height="${imgHeight}" rx="${cornerRadius}" fill="#FFFFFF" filter="url(#cardShadow)"/>
      <rect x="662" y="60" width="${imgWidth}" height="${imgHeight}" rx="${cornerRadius}" fill="none" stroke="#E2EBE0" stroke-width="2"/>
    </svg>
  `);

  // 4. Overlaid Stats Card at the bottom of the photo (clean frosted white pill)
  const statsOverlay = Buffer.from(`
    <svg width="${imgWidth}" height="114" viewBox="0 0 ${imgWidth} 114" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="whiteFrost" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.92)"/>
          <stop offset="100%" stop-color="rgba(255, 255, 255, 0.98)"/>
        </linearGradient>
      </defs>

      <!-- Frosted card with matching bottom rounded corners -->
      <path d="M 0 14 Q 0 0 14 0 L ${imgWidth - 14} 0 Q ${imgWidth} 0 ${imgWidth} 14 L ${imgWidth} ${114 - cornerRadius} Q ${imgWidth} 114 ${imgWidth - cornerRadius} 114 L ${cornerRadius} 114 Q 0 114 0 ${114 - cornerRadius} Z" fill="url(#whiteFrost)" stroke="#E2EBE0" stroke-width="1"/>

      <!-- Stat 1: Students -->
      <text x="24" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#556B2F">1,650+</text>
      <text x="24" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#6B7280" letter-spacing="0.8">STUDENTS REACHED</text>

      <line x1="164" y1="16" x2="164" y2="64" stroke="#E5E7EB" stroke-width="1.5"/>

      <!-- Stat 2: Institutions -->
      <text x="184" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#1F2937">14+</text>
      <text x="184" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#6B7280" letter-spacing="0.8">INSTITUTIONS</text>

      <line x1="290" y1="16" x2="290" y2="64" stroke="#E5E7EB" stroke-width="1.5"/>

      <!-- Stat 3: Workshops -->
      <text x="310" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#D97706">20+</text>
      <text x="310" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#6B7280" letter-spacing="0.8">WORKSHOPS</text>

      <!-- Initiatives ribbon -->
      <rect x="20" y="74" width="${imgWidth - 40}" height="26" rx="13" fill="#F4F8F1"/>
      <text x="${imgWidth / 2}" y="91" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#3D5523" letter-spacing="0.4">
        ✨ Flagship Programs: Baat-Cheet • Sahi Manzil
      </text>
    </svg>
  `);

  // 5. Composite together
  await sharp(svgBackground)
    .composite([
      // Workshop Photo
      {
        input: photoBuffer,
        top: 60,
        left: 662
      },
      // Stats Overlay at bottom of Photo
      {
        input: statsOverlay,
        top: 60 + (imgHeight - 114),
        left: 662
      },
      // Clean authentic Logo (contained, properly margined, never clipped or overflowing)
      {
        input: logoBuffer,
        top: 108,
        left: 68
      }
    ])
    .png({ quality: 95 })
    .toFile('frontend/public/og-image.png');

  // Also write og-image.jpg
  await sharp('frontend/public/og-image.png')
    .jpeg({ quality: 92 })
    .toFile('frontend/public/og-image.jpg');

  console.log('✅ Generated clean light-theme OG Card at frontend/public/og-image.png');
  console.log('✅ Generated clean light-theme OG Card at frontend/public/og-image.jpg');
}

generateOgCard().catch(err => {
  console.error('Error generating card:', err);
  process.exit(1);
});
