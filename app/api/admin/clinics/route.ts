import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { clinics } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  return NextResponse.json(await db.select().from(clinics))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { name, address } = await req.json()
  if (!name) return NextResponse.json({ error: 'İsim zorunlu' }, { status: 400 })

  const [h] = await db.insert(clinics).values({ name, address }).returning()
  return NextResponse.json(h, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  try {
    await db.delete(clinics).where(eq(clinics.id, id))
    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (e.message?.includes('FOREIGN KEY') || e.message?.includes('foreign key') || e.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return NextResponse.json({ error: 'Bu kliniğe bağlı doktor, hasta veya randevular bulunduğu için silinemez. Önce onlara ait kayıtları silmelisiniz.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Silinirken bir hata oluştu: ' + (e.message || String(e)) }, { status: 500 })
  }
}
