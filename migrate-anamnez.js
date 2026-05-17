const { createClient } = require('@libsql/client')
const client = createClient({ url: 'file:local.db' })

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
  console.log('anamnez_sorulari tablosu olusturuldu veya zaten var.')
  client.close()
}

migrate().catch(e => { console.error(e); client.close(); process.exit(1) })
