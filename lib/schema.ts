import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  role: text('role', { enum: ['hasta', 'doktor', 'admin'] }).notNull().default('hasta'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// Hastane yerine Şube / Klinik Lokasyonu
export const clinics = sqliteTable('clinics', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  address: text('address'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

export const doctors = sqliteTable('doctors', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  clinicId: text('clinic_id').notNull().references(() => clinics.id),
  title: text('title').notNull().default('Odyolog'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  patientId: text('patient_id').notNull().references(() => users.id),
  doctorId: text('doctor_id').notNull().references(() => doctors.id),
  clinicId: text('clinic_id').notNull().references(() => clinics.id),
  appointmentDate: text('appointment_date').notNull(),
  status: text('status', { enum: ['beklemede', 'onaylandi', 'iptal', 'tamamlandi'] }).notNull().default('beklemede'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// Dinamik Anamnez Formu
export const anamnezForms = sqliteTable('anamnez_forms', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  appointmentId: text('appointment_id').notNull().references(() => appointments.id),
  reason: text('reason').notNull(), // İşitme azlığı, Çınlama vb.
  ageGroup: text('age_group').notNull(), // 0-18, 18-65, 65+
  formData: text('form_data', { mode: 'json' }).notNull(), // Sorular ve cevaplar JSON olarak tutulacak
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})
