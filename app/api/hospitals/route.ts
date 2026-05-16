import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hospitals } from '@/lib/schema'

export async function GET() {
  const data = await db.select().from(hospitals)
  return NextResponse.json(data)
}
