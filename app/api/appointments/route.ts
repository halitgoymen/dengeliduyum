import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { appointments, anamnezForms, doctors, users, clinics } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const role = session.user.role
  const userId = session.user.id

  let data: any[] = []

  if (role === 'hasta') {
    data = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        createdAt: appointments.createdAt,
        doctorName: users.fullName,
        doctorTitle: doctors.title,
        clinicId: appointments.clinicId,
      })
      .from(appointments)
      .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
      .innerJoin(users, eq(doctors.userId, users.id))
      .where(eq(appointments.patientId, userId))
      .orderBy(desc(appointments.createdAt))
  } else if (role === 'doktor') {
    const doctor = await db.select().from(doctors).where(eq(doctors.userId, userId)).get()
    if (!doctor) return NextResponse.json([])
    data = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        createdAt: appointments.createdAt,
        patientName: users.fullName,
        patientPhone: users.phone,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.patientId, users.id))
      .where(eq(appointments.doctorId, doctor.id))
      .orderBy(desc(appointments.createdAt))
  } else if (role === 'admin') {
    data = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        createdAt: appointments.createdAt,
        patientName: users.fullName,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.patientId, users.id))
      .orderBy(desc(appointments.createdAt))
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'hasta') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const body = await req.json()
    const { doctorId, clinicId, appointmentDate, reason, ageGroup, formData } = body

    const [appt] = await db.insert(appointments).values({
      patientId: session.user.id,
      doctorId, clinicId, appointmentDate,
    }).returning()

    if (appt) {
      await db.insert(anamnezForms).values({
        appointmentId: appt.id,
        reason,
        ageGroup,
        formData: typeof formData === 'string' ? formData : JSON.stringify(formData || {}),
      })
    }

    return NextResponse.json({ success: true, id: appt.id }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
