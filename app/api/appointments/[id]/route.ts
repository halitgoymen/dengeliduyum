import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { appointments, anamnezForms, doctors, users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params

  const appt = await db.select().from(appointments).where(eq(appointments.id, id)).get()
  if (!appt) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const anamnez = await db.select().from(anamnezForms).where(eq(anamnezForms.appointmentId, id)).get()
  const patient = await db.select({ fullName: users.fullName, email: users.email, phone: users.phone }).from(users).where(eq(users.id, appt.patientId)).get()
  const doctor = await db
    .select({ fullName: users.fullName, title: doctors.title })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.id, appt.doctorId))
    .get()

  return NextResponse.json({ ...appt, anamnez, patient, doctor })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role === 'hasta') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  await db.update(appointments).set({ status }).where(eq(appointments.id, id))
  return NextResponse.json({ success: true })
}
