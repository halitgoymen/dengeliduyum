const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function migrate() {
  try {
    await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN hasta_tipi TEXT DEFAULT "tum"');
    console.log('hasta_tipi eklendi');
  } catch (e) { console.log('hasta_tipi zaten var veya hata:', e.message); }
  
  try {
    await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN bagli_soru_id TEXT');
    console.log('bagli_soru_id eklendi');
  } catch (e) { console.log('bagli_soru_id zaten var veya hata:', e.message); }
  
  try {
    await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN bagli_cevap TEXT');
    console.log('bagli_cevap eklendi');
  } catch (e) { console.log('bagli_cevap zaten var veya hata:', e.message); }
  
  try {
    await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN uyari_mesaji TEXT'); // JSON string as { "answer": "Warning Message" }
    console.log('uyari_mesaji eklendi');
  } catch (e) { console.log('uyari_mesaji zaten var veya hata:', e.message); }

  client.close();
}

migrate();
