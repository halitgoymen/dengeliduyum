import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { eq, inArray } from 'drizzle-orm'
import { appointments, anamnezForms, doctors, users, anamnezSorulari } from '@/lib/schema'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params

  const appt = await db.select().from(appointments).where(eq(appointments.id, id)).get()
  if (!appt) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const anamnez = await db.select().from(anamnezForms).where(eq(anamnezForms.appointmentId, id)).get()
  
  let questions: any[] = []
  if (anamnez) {
    let parsedForm: Record<string, string> = {}
    try {
      parsedForm = typeof anamnez.formData === 'string' ? JSON.parse(anamnez.formData) : anamnez.formData
    } catch (e) {}

    const questionIds = Object.keys(parsedForm || {})
    if (questionIds.length > 0) {
      questions = await db
        .select({ id: anamnezSorulari.id, soru: anamnezSorulari.soru })
        .from(anamnezSorulari)
        .where(inArray(anamnezSorulari.id, questionIds))
        .all()
    }
  }

  const patient = await db.select({ fullName: users.fullName, email: users.email, phone: users.phone }).from(users).where(eq(users.id, appt.patientId)).get()
  const doctor = await db
    .select({ fullName: users.fullName, title: doctors.title })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.id, appt.doctorId))
    .get()

  const responseAnamnez = anamnez ? { ...anamnez, questions } : null

  return NextResponse.json({ ...appt, anamnez: responseAnamnez, patient, doctor })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role === 'hasta') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  await db.update(appointments).set({ status }).where(eq(appointments.id, id))
  return NextResponse.json({ success: true })
}
