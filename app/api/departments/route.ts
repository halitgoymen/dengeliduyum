import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { departments } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const hospitalId = req.nextUrl.searchParams.get('hospitalId')
  if (!hospitalId) return NextResponse.json({ error: 'hospitalId gerekli' }, { status: 400 })
  const data = await db.select().from(departments).where(eq(departments.hospitalId, hospitalId))
  return NextResponse.json(data)
}
