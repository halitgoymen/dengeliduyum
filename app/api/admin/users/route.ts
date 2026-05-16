import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const data = await db
    .select({ id: users.id, fullName: users.fullName, email: users.email, role: users.role, phone: users.phone, createdAt: users.createdAt })
    .from(users)

  return NextResponse.json(data)
}
