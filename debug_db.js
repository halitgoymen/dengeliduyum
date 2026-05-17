const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

// We want to test both databases: local.db and remote Turso!
const dbs = [
  { name: 'Local DB', client: createClient({ url: 'file:local.db' }) },
  { name: 'Turso DB', client: createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN }) }
];

async function run() {
  for (const dbInfo of dbs) {
    console.log(`=== Testing ${dbInfo.name} ===`);
    try {
      // 1. Let's see the unique categories
      const cats = await dbInfo.client.execute("SELECT DISTINCT kategori FROM anamnez_sorulari");
      console.log("Categories in DB:", cats.rows.map(r => r.kategori));
      
      // 2. Query for "Yeni Hasta Şikayetleri" and "yeni" and "tum"/"18-65 yaş"
      const res1 = await dbInfo.client.execute({
        sql: "SELECT id, kategori, yas_grubu, hasta_tipi, soru, aktif FROM anamnez_sorulari WHERE kategori = ? AND aktif = 1",
        args: ["Yeni Hasta Şikayetleri"]
      });
      console.log("Yeni Hasta Şikayetleri count:", res1.rows.length);
      console.log("Filtered for hasta_tipi = 'yeni' and yas_grubu in ('tum', '18-65 yaş'):", 
        res1.rows.filter(r => (r.hasta_tipi === 'tum' || r.hasta_tipi === 'yeni') && (r.yas_grubu === 'tum' || r.yas_grubu === '18-65 yaş')).length
      );

      // 3. Query for "Çocuk randevusu (ebeveyn girişi)" and "yeni" and "tum"/"0-18 yaş"
      const res2 = await dbInfo.client.execute({
        sql: "SELECT id, kategori, yas_grubu, hasta_tipi, soru, aktif FROM anamnez_sorulari WHERE kategori = ? AND aktif = 1",
        args: ["Çocuk randevusu (ebeveyn girişi)"]
      });
      console.log("Çocuk randevusu count:", res2.rows.length);
      console.log("Filtered for hasta_tipi = 'yeni' and yas_grubu in ('tum', '0-18 yaş'):", 
        res2.rows.filter(r => (r.hasta_tipi === 'tum' || r.hasta_tipi === 'yeni') && (r.yas_grubu === 'tum' || r.yas_grubu === '0-18 yaş')).length
      );
      
    } catch (e) {
      console.error("Error with database:", e.message);
    } finally {
      dbInfo.client.close();
    }
  }
}

run();
