#!/usr/bin/env node

/**
 * Generates simple placeholder icons for the metronome app
 * These are basic SVG-based icons that can be replaced with proper designs later
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets', 'images');

// Ensure directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// SVG content for icons (simple metronome shape)
const createIconSVG = (size, bgColor, fgColor, addShape = true) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  ${addShape ? `
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Metronome body -->
    <path d="M -${size*0.15} ${size*0.25} L -${size*0.25} -${size*0.25} L ${size*0.25} -${size*0.25} L ${size*0.15} ${size*0.25} Z" 
          fill="${fgColor}" stroke="${fgColor}" stroke-width="2"/>
    <!-- Pendulum -->
    <line x1="0" y1="-${size*0.2}" x2="${size*0.08}" y2="${size*0.2}" 
          stroke="${fgColor === '#FFFFFF' ? '#E0E0E0' : '#333333'}" stroke-width="${size*0.02}"/>
    <circle cx="${size*0.08}" cy="${size*0.2}" r="${size*0.04}" fill="${fgColor === '#FFFFFF' ? '#E0E0E0' : '#333333'}"/>
  </g>
  ` : ''}
</svg>
`;

// Generate icon files
const icons = [
  { name: 'icon.png', size: 1024, bg: '#E6F4FE', fg: '#1C1B1F', shape: true },
  { name: 'favicon.png', size: 48, bg: '#E6F4FE', fg: '#1C1B1F', shape: true },
  { name: 'splash-icon.png', size: 200, bg: 'transparent', fg: '#1C1B1F', shape: true },
  { name: 'android-icon-foreground.png', size: 1024, bg: 'transparent', fg: '#1C1B1F', shape: true },
  { name: 'android-icon-background.png', size: 1024, bg: '#E6F4FE', fg: '#E6F4FE', shape: false },
  { name: 'android-icon-monochrome.png', size: 1024, bg: 'transparent', fg: '#FFFFFF', shape: true },
];

console.log('Generating placeholder icons...');

icons.forEach(({ name, size, bg, fg, shape }) => {
  const svgContent = createIconSVG(size, bg, fg, shape);
  const svgPath = path.join(assetsDir, name.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svgContent.trim());
  console.log(`✓ Created ${name.replace('.png', '.svg')}`);
});

console.log('\nNote: SVG files created. For PNG conversion, use:');
console.log('  npx expo prebuild --clean');
console.log('  or use an online SVG to PNG converter');
console.log('\nAlternatively, install @expo/image-utils for automatic conversion.');
