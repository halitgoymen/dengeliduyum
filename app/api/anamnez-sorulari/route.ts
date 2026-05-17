import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { anamnezSorulari } from '@/lib/schema'
import { eq, and, asc } from 'drizzle-orm'

// Hasta tarafı: belirli kategori+yaşGrubu için aktif soruları getir
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const kategori = req.nextUrl.searchParams.get('kategori')
  const yasGrubu = req.nextUrl.searchParams.get('yasGrubu')
  const hastaTipi = req.nextUrl.searchParams.get('hastaTipi') || 'tum'

  if (!kategori || !yasGrubu)
    return NextResponse.json({ error: 'kategori ve yasGrubu gerekli' }, { status: 400 })

  // Hem 'tum' hem de eşleşen yaş grubunu getir
  const rows = await db
    .select()
    .from(anamnezSorulari)
    .where(
      and(
        eq(anamnezSorulari.kategori, kategori),
        eq(anamnezSorulari.aktif, true),
      )
    )
    .orderBy(asc(anamnezSorulari.sira))

  // Yaş grubu ve hasta tipine göre filtrele
  const filtered = rows.filter(r => 
    (r.yasGrubu === 'tum' || r.yasGrubu === yasGrubu) &&
    (r.hastaTipi === 'tum' || r.hastaTipi === hastaTipi)
  )

  return NextResponse.json(filtered)
}
