import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, phone } = await req.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Tüm zorunlu alanları doldurun.' }, { status: 400 })
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).get()
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await db.insert(users).values({
      email, password: hashed, fullName, phone, role: 'hasta',
    }).returning().get()

    return NextResponse.json({ success: true, id: user.id }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
