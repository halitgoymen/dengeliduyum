import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { clinics } from '@/lib/schema'

export async function GET() {
  const data = await db.select().from(clinics)
  return NextResponse.json(data)
}
