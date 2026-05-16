import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { doctors, users, clinics } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const data = await db
    .select({
      id: doctors.id,
      title: doctors.title,
      fullName: users.fullName,
      email: users.email,
      clinicId: doctors.clinicId,
      createdAt: doctors.createdAt,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const { email, password, fullName, phone, title, clinicId } = await req.json()

    const existing = await db.select().from(users).where(eq(users.email, email)).get()
    if (existing) return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 12)
    const [user] = await db.insert(users).values({ email, password: hashed, fullName, phone, role: 'doktor' }).returning()
    await db.insert(doctors).values({ userId: user.id, clinicId, title: title || 'Odyolog' })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  try {
    // Önce doktorun user_id'sini alalım ki kullanıcı tablosundan da silebilelim
    const doc = await db.select().from(doctors).where(eq(doctors.id, id)).get()
    if (!doc) return NextResponse.json({ error: 'Doktor bulunamadı' }, { status: 404 })

    await db.delete(doctors).where(eq(doctors.id, id))
    await db.delete(users).where(eq(users.id, doc.userId))

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e)
    if (e.message?.includes('FOREIGN KEY') || e.message?.includes('foreign key')) {
      return NextResponse.json({ error: 'Bu doktora ait randevular bulunduğu için silinemez. Önce randevularını silmelisiniz.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Silinirken bir hata oluştu' }, { status: 500 })
  }
}
