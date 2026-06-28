const fs = require('fs');
const zlib = require('zlib');

function readPngColor(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // Verify PNG signature
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error('Not a valid PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let idatBuffers = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.slice(offset + 8, offset + 8 + length);
    
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      console.log(`IHDR: ${width}x${height}, bitDepth=${bitDepth}, colorType=${colorType}`);
    } else if (type === 'IDAT') {
      idatBuffers.push(data);
    } else if (type === 'IEND') {
      break;
    }
    
    offset += 12 + length;
  }

  const idatBuffer = Buffer.concat(idatBuffers);
  const inflated = zlib.inflateSync(idatBuffer);

  // Parse pixels
  // For colorType 6 (RGBA) and bitDepth 8:
  // Each row starts with a filter byte (1 byte), followed by width * 4 bytes (R, G, B, A)
  if (colorType === 6 && bitDepth === 8) {
    let pos = 0;
    for (let y = 0; y < height; y++) {
      const filter = inflated[pos++];
      // We skip filter undoing for simplicity, and just look for raw values if filter is 0,
      // or we can undo standard filters. Let's print some sample bytes.
      const rowBytes = width * 4;
      const row = inflated.slice(pos, pos + rowBytes);
      pos += rowBytes;

      for (let x = 0; x < width; x++) {
        const r = row[x * 4];
        const g = row[x * 4 + 1];
        const b = row[x * 4 + 2];
        const a = row[x * 4 + 3];
        // If it's a solid colored pixel (high opacity, not white, not black)
        if (a > 200 && !(r > 240 && g > 240 && b > 240) && !(r < 15 && g < 15 && b < 15)) {
          console.log(`Found color pixel at (${x}, ${y}): rgba(${r}, ${g}, ${b}, ${a})`);
          return [r, g, b];
        }
      }
    }
  } else {
    console.log(`Unsupported PNG type: colorType=${colorType}, bitDepth=${bitDepth}`);
  }
}

try {
  console.log("Reading logo.png:");
  readPngColor('c:/Users/bijul/OneDrive/Documents/scarlet/scarlet-thread/public/images/logo/logo.png');
  console.log("Reading name.png:");
  readPngColor('c:/Users/bijul/OneDrive/Documents/scarlet/scarlet-thread/public/images/logo/name.png');
} catch (e) {
  console.error(e);
}
