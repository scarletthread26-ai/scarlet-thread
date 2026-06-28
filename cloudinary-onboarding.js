#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load environment variables from .env.local if it exists
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      // Ignore comments and empty lines
      if (line.trim().startsWith('#') || !line.includes('=')) return;
      const [key, ...valueParts] = line.split('=');
      let value = valueParts.join('=').trim();
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key.trim()] = value;
    });
  }
} catch (err) {
  console.warn('Warning: Could not read .env.local file. Falling back to environment variables.');
}

// 1. Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function runOnboarding() {
  try {
    console.log('Starting Cloudinary Onboarding...');
    console.log(`Cloud Name configured: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Yes' : 'No'}`);
    console.log(`API Key configured: ${process.env.CLOUDINARY_API_KEY ? 'Yes' : 'No'}`);
    console.log(`API Secret configured: ${process.env.CLOUDINARY_API_SECRET ? 'Yes' : 'No'}`);

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary environment variables are missing. Please check your .env.local file.');
    }

    // 2. Upload an image from Cloudinary\'s demo domains
    const imageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    console.log(`\nUploading image from URL: ${imageUrl}`);
    
    const uploadResult = await cloudinary.uploader.upload(imageUrl);
    
    console.log('\n--- Upload Result ---');
    console.log(`Secure URL: ${uploadResult.secure_url}`);
    console.log(`Public ID: ${uploadResult.public_id}`);

    // 3. Get image details by fetching metadata about the uploaded image
    console.log('\n--- Fetching Image Details ---');
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log(`Width: ${details.width}px`);
    console.log(`Height: ${details.height}px`);
    console.log(`Format: ${details.format}`);
    console.log(`File Size: ${details.bytes} bytes`);

    // 4. Transform the image
    // Generate a transformed version of the image URL using f_auto and q_auto
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      // f_auto (fetch_format: 'auto') automatically delivers the image in the most optimal format (like WebP or AVIF) supported by the requesting browser.
      fetch_format: 'auto',
      // q_auto (quality: 'auto') automatically optimizes the image quality to minimize file size while maintaining visual fidelity.
      quality: 'auto',
      secure: true
    });

    console.log('\n--- Transformation ---');
    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(transformedUrl);

  } catch (error) {
    console.error('An error occurred during execution:', error.message || error);
    process.exit(1);
  }
}

runOnboarding();
