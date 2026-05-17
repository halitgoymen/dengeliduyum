const { createClient } = require('@libsql/client');

const client = createClient({ 
  url: 'file:local.db'
});

async function migrate() {
  try { await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN hasta_tipi TEXT DEFAULT "tum"'); console.log('hasta_tipi eklendi'); } catch (e) { console.log(e.message); }
  try { await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN bagli_soru_id TEXT'); console.log('bagli_soru_id eklendi'); } catch (e) { console.log(e.message); }
  try { await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN bagli_cevap TEXT'); console.log('bagli_cevap eklendi'); } catch (e) { console.log(e.message); }
  try { await client.execute('ALTER TABLE anamnez_sorulari ADD COLUMN uyari_mesaji TEXT'); console.log('uyari_mesaji eklendi'); } catch (e) { console.log(e.message); }
  client.close();
}

migrate();
