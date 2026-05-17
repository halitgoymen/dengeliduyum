const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function run() {
  const rs = await client.execute("SELECT * FROM anamnez_sorulari WHERE kategori = 'Yeni Hasta Şikayetleri'");
  console.log("Yeni Hasta Şikayetleri count:", rs.rows.length);
  if (rs.rows.length > 0) {
    console.log("First:", rs.rows[0]);
  }
  
  const rs2 = await client.execute("SELECT * FROM anamnez_sorulari WHERE hasta_tipi = 'yeni'");
  console.log("yeni count:", rs2.rows.length);
  
  client.close();
}

run();
