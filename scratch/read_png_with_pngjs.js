const fs = require('fs');
const PNG = require('pngjs').PNG;

function getColor(filePath) {
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);
  
  // Find the most frequent color that is not white, black, or transparent
  const colorCounts = {};
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      const a = png.data[idx + 3];
      
      // If fully opaque (or high opacity) and not white/black
      if (a > 200 && !(r > 240 && g > 240 && b > 240) && !(r < 15 && g < 15 && b < 15)) {
        const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }
    }
  }
  
  const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
  console.log(`Top colors in ${filePath}:`);
  for (let i = 0; i < Math.min(5, sortedColors.length); i++) {
    console.log(`  #${sortedColors[i][0]}: ${sortedColors[i][1]} pixels`);
  }
}

try {
  getColor('c:/Users/bijul/OneDrive/Documents/scarlet/scarlet-thread/public/images/logo/logo.png');
  getColor('c:/Users/bijul/OneDrive/Documents/scarlet/scarlet-thread/public/images/logo/name.png');
} catch (e) {
  console.error(e);
}
