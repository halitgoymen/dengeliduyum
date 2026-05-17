const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function migrate() {
  await client.execute(
    'CREATE TABLE IF NOT EXISTS anamnez_sorulari (' +
    'id TEXT PRIMARY KEY NOT NULL,' +
    'kategori TEXT NOT NULL,' +
    'yas_grubu TEXT NOT NULL DEFAULT "tum",' +
    'soru TEXT NOT NULL,' +
    'secenekler TEXT NOT NULL,' +
    'sira INTEGER NOT NULL DEFAULT 0,' +
    'aktif INTEGER NOT NULL DEFAULT 1,' +
    'created_at TEXT NOT NULL,' +
    'updated_at TEXT NOT NULL' +
    ')'
  )
  console.log('Turso DB anamnez_sorulari tablosu olusturuldu.');
  client.close();
}

migrate().catch(e => { console.error(e); client.close(); process.exit(1); });
