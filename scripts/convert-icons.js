#!/usr/bin/env node

/**
 * Converts SVG icons to PNG using sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'assets', 'images');

const icons = [
  { name: 'icon', size: 1024 },
  { name: 'favicon', size: 48 },
  { name: 'splash-icon', size: 200 },
  { name: 'android-icon-foreground', size: 1024 },
  { name: 'android-icon-background', size: 1024 },
  { name: 'android-icon-monochrome', size: 1024 },
];

async function convertIcons() {
  console.log('Converting SVG icons to PNG...');
  
  for (const { name, size } of icons) {
    const svgPath = path.join(assetsDir, `${name}.svg`);
    const pngPath = path.join(assetsDir, `${name}.png`);
    
    if (fs.existsSync(svgPath)) {
      try {
        await sharp(svgPath)
          .resize(size, size)
          .png()
          .toFile(pngPath);
        console.log(`✓ Converted ${name}.svg → ${name}.png`);
      } catch (error) {
        console.error(`✗ Failed to convert ${name}.svg:`, error.message);
      }
    }
  }
  
  console.log('\nDone! Icons are ready for Android.');
}

convertIcons().catch(console.error);
