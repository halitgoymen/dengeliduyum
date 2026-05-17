import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './lib/db.js';
import { anamnezSorulari } from './lib/schema.js';
import { eq, and, asc } from 'drizzle-orm';

async function test(kategori, yasGrubu, hastaTipi) {
  try {
    console.log(`Querying for: Kategori="${kategori}", YasGrubu="${yasGrubu}", HastaTipi="${hastaTipi}"`);
    const rows = await db
      .select()
      .from(anamnezSorulari)
      .where(
        and(
          eq(anamnezSorulari.kategori, kategori),
          eq(anamnezSorulari.aktif, true)
        )
      )
      .orderBy(asc(anamnezSorulari.sira));

    console.log(`Drizzle returned ${rows.length} rows before filtering.`);
    
    const filtered = rows.filter(r => 
      (r.yasGrubu === 'tum' || r.yasGrubu === yasGrubu) &&
      (r.hastaTipi === 'tum' || r.hastaTipi === hastaTipi)
    );
    console.log(`Filtered returned ${filtered.length} rows.`);
    if (filtered.length > 0) {
      console.log("First question:", filtered[0].soru);
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  // Test case 1: Takipli, Çocuk randevusu (ebeveyn girişi), 0-18 yaş
  await test("Çocuk randevusu (ebeveyn girişi)", "0-18 yaş", "takipli");
  
  // Test case 2: Yeni, Yeni Hasta Şikayetleri, 18-65 yaş
  await test("Yeni Hasta Şikayetleri", "18-65 yaş", "yeni");
  
  process.exit(0);
}

run();
