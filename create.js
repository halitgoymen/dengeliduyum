const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });

async function run() {
  console.log("Creating tables...");
  await client.executeMultiple(`
    CREATE TABLE \`users\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`email\` text NOT NULL,
      \`password\` text NOT NULL,
      \`full_name\` text NOT NULL,
      \`phone\` text,
      \`role\` text DEFAULT 'hasta' NOT NULL,
      \`created_at\` text NOT NULL
    );
    CREATE UNIQUE INDEX \`users_email_unique\` ON \`users\` (\`email\`);

    CREATE TABLE \`clinics\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`name\` text NOT NULL,
      \`address\` text,
      \`created_at\` text NOT NULL
    );

    CREATE TABLE \`doctors\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`user_id\` text NOT NULL,
      \`clinic_id\` text NOT NULL,
      \`title\` text DEFAULT 'Odyolog' NOT NULL,
      \`created_at\` text NOT NULL,
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action,
      FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON UPDATE no action ON DELETE no action
    );

    CREATE TABLE \`appointments\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`patient_id\` text NOT NULL,
      \`doctor_id\` text NOT NULL,
      \`clinic_id\` text NOT NULL,
      \`appointment_date\` text NOT NULL,
      \`status\` text DEFAULT 'beklemede' NOT NULL,
      \`created_at\` text NOT NULL,
      FOREIGN KEY (\`patient_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action,
      FOREIGN KEY (\`doctor_id\`) REFERENCES \`doctors\`(\`id\`) ON UPDATE no action ON DELETE no action,
      FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON UPDATE no action ON DELETE no action
    );

    CREATE TABLE \`anamnez_forms\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`appointment_id\` text NOT NULL,
      \`reason\` text NOT NULL,
      \`age_group\` text NOT NULL,
      \`form_data\` text NOT NULL,
      \`created_at\` text NOT NULL,
      FOREIGN KEY (\`appointment_id\`) REFERENCES \`appointments\`(\`id\`) ON UPDATE no action ON DELETE no action
    );
  `);
  console.log("Created.");
}
run().catch(console.error);
