import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, clinics, doctors } from '@/lib/schema'
import bcrypt from 'bcryptjs'

export async function GET() {
  const adminPass = await bcrypt.hash('admin123', 12)
  await db.insert(users).values({
    email: 'admin@anamnez.com', password: adminPass,
    fullName: 'Sistem Yöneticisi', role: 'admin',
  }).onConflictDoNothing()

  const [c1] = await db.insert(clinics).values({ name: 'OdyoLife Merkez Klinik', address: 'Şişli, İstanbul' }).returning()
  const [c2] = await db.insert(clinics).values({ name: 'OdyoLife Anadolu Şubesi', address: 'Kadıköy, İstanbul' }).returning()

  const doc1Pass = await bcrypt.hash('doktor123', 12)
  const [u1] = await db.insert(users).values({ email: 'odyolog1@anamnez.com', password: doc1Pass, fullName: 'Ahmet Yılmaz', role: 'doktor' }).returning()
  const [u2] = await db.insert(users).values({ email: 'odyolog2@anamnez.com', password: doc1Pass, fullName: 'Elif Kaya', role: 'doktor' }).returning()

  await db.insert(doctors).values({ userId: u1.id, clinicId: c1.id, title: 'Uzm. Odyolog' })
  await db.insert(doctors).values({ userId: u2.id, clinicId: c2.id, title: 'Odyolog' })

  const patPass = await bcrypt.hash('hasta123', 12)
  await db.insert(users).values({ email: 'hasta@anamnez.com', password: patPass, fullName: 'Test Hasta', phone: '05001234567', role: 'hasta' }).onConflictDoNothing()

  return NextResponse.json({
    success: true,
    message: 'Seed tamamlandı!',
    logins: {
      admin: { email: 'admin@anamnez.com', password: 'admin123' },
      doktor: { email: 'odyolog1@anamnez.com', password: 'doktor123' },
      hasta: { email: 'hasta@anamnez.com', password: 'hasta123' },
    },
  })
}
