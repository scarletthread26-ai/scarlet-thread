const { createClient } = require('@supabase/supabase-js');

const url = 'https://lljznlcbyzrfvowomjwa.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsanpubGNieXpyZnZvd29tandhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ0NjUyNiwiZXhwIjoyMDk4MDIyNTI2fQ.zP0kdaexFzDpJ1ygWTz-6ueRab4ZJRa8LULdwvoVdJ8';

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      product_images(url, is_primary)
    `);
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}
run();
