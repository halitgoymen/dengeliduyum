import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { doctors, users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get('clinicId')
  if (!clinicId) return NextResponse.json({ error: 'clinicId gerekli' }, { status: 400 })

  const data = await db
    .select({
      id: doctors.id,
      title: doctors.title,
      fullName: users.fullName,
      clinicId: doctors.clinicId,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.clinicId, clinicId))

  return NextResponse.json(data)
}
