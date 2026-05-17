import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log("URL:", process.env.DATABASE_URL);

import { db } from './lib/db.js';
import { anamnezSorulari } from './lib/schema.js';
import { eq, and } from 'drizzle-orm';

async function test() {
  try {
    const rows = await db
      .select()
      .from(anamnezSorulari)
      .where(
        and(
          eq(anamnezSorulari.kategori, 'Yeni Hasta Şikayetleri'),
          eq(anamnezSorulari.aktif, true)
        )
      );
    console.log("Drizzle returned:", rows.length, "rows.");
  } catch (e) {
    console.error(e.message);
  }
}
test();
