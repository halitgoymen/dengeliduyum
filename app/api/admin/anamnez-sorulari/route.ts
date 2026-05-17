import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { anamnezSorulari } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin')
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const data = await db
    .select()
    .from(anamnezSorulari)
    .orderBy(asc(anamnezSorulari.kategori), asc(anamnezSorulari.sira))

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin')
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const { kategori, yasGrubu, soru, secenekler, sira, aktif } = await req.json()

    if (!kategori || !soru || !Array.isArray(secenekler) || secenekler.length === 0)
      return NextResponse.json({ error: 'Kategori, soru ve en az bir seçenek zorunludur.' }, { status: 400 })

    const [created] = await db
      .insert(anamnezSorulari)
      .values({
        kategori,
        yasGrubu: yasGrubu || 'tum',
        soru,
        secenekler,
        sira: sira ?? 0,
        aktif: aktif !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin')
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  try {
    const { kategori, yasGrubu, soru, secenekler, sira, aktif } = await req.json()

    if (!kategori || !soru || !Array.isArray(secenekler) || secenekler.length === 0)
      return NextResponse.json({ error: 'Kategori, soru ve en az bir seçenek zorunludur.' }, { status: 400 })

    const [updated] = await db
      .update(anamnezSorulari)
      .set({
        kategori,
        yasGrubu: yasGrubu || 'tum',
        soru,
        secenekler,
        sira: sira ?? 0,
        aktif: aktif !== false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(anamnezSorulari.id, id))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Soru bulunamadı' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin')
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  try {
    await db.delete(anamnezSorulari).where(eq(anamnezSorulari.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Silinirken hata oluştu.' }, { status: 500 })
  }
}
