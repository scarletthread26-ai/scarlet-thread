const { createClient } = require('@supabase/supabase-js');

const url = 'https://lljznlcbyzrfvowomjwa.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsanpubGNieXpyZnZvd29tandhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ0NjUyNiwiZXhwIjoyMDk4MDIyNTI2fQ.zP0kdaexFzDpJ1ygWTz-6ueRab4ZJRa8LULdwvoVdJ8';

const supabase = createClient(url, key);

const imagesToInsert = [
  {
    product_id: 'f3a0e660-31e0-4966-9e1f-7b0028ed2cd4', // Personalized Hooded Towel
    url: '/images/scarlet-lovedgift2.png',
    is_primary: true
  },
  {
    product_id: 'a3a0e660-31e0-4966-9e1f-7b0028ed2cd5', // Mama Heart Hoodie
    url: '/images/scarlet-lovedgift1.png',
    is_primary: true
  },
  {
    product_id: '13a0e660-31e0-4966-9e1f-7b0028ed2cd6', // Bride Cosmetic Pouch
    url: '/images/scarlet-lovedgift3.png',
    is_primary: true
  },
  {
    product_id: '23a0e660-31e0-4966-9e1f-7b0028ed2cd7', // Leather Wallet with Initials
    url: '/images/papa.png',
    is_primary: true
  }
];

async function run() {
  const { data, error } = await supabase
    .from('product_images')
    .insert(imagesToInsert);
  
  if (error) {
    console.error('Error inserting images:', error);
  } else {
    console.log('Successfully inserted product images!');
  }
}
run();
