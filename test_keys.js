import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './lib/db.js';
import { anamnezSorulari } from './lib/schema.js';
import { eq } from 'drizzle-orm';

async function test() {
  try {
    const rows = await db
      .select()
      .from(anamnezSorulari)
      .limit(1);
    console.log("Row keys:", Object.keys(rows[0]));
    console.log("Row sample:", rows[0]);
  } catch (e) {
    console.error(e.message);
  }
}
test();
