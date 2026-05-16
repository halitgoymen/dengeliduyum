const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({ 
  url: process.env.DATABASE_URL, 
  authToken: process.env.DATABASE_AUTH_TOKEN 
});

async function run() {
  console.log("Dropping old tables...");
  await client.executeMultiple(`
    DROP TABLE IF EXISTS anamnez_forms;
    DROP TABLE IF EXISTS appointments;
    DROP TABLE IF EXISTS doctors;
    DROP TABLE IF EXISTS departments;
    DROP TABLE IF EXISTS hospitals;
    DROP TABLE IF EXISTS clinics;
    DROP TABLE IF EXISTS users;
  `);
  console.log("Dropped.");
}
run().catch(console.error);
