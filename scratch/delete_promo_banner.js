const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing credentials");
  process.exit(1);
}

async function run() {
  const url = `${supabaseUrl}/rest/v1/banners?banner_type=eq.promo`;
  console.log("Calling DELETE on:", url);
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Error from API:", response.status, errText);
  } else {
    const data = await response.json();
    console.log("Successfully deleted:", data);
  }
}

run();
