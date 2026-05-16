'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuestionsFor } from '@/lib/form-questions'

const STATUS_MAP: Record<string, string> = {
  beklemede: 'Beklemede', onaylandi: 'Onaylandı', iptal: 'İptal', tamamlandi: 'Tamamlandı',
}

export default function RandevuDetay() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetch(`/api/appointments/${id}`).then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setData((p: any) => ({ ...p, status }))
    setUpdating(false)
  }

  if (loading) return (
    <>
      <div className="page-header"><h1 className="page-title">Randevu Detayı</h1></div>
      <div className="page-body"><p className="text-muted">Yükleniyor…</p></div>
    </>
  )
  if (!data || data.error) return (
    <>
      <div className="page-header"><h1 className="page-title">Hata</h1></div>
      <div className="page-body"><p>Randevu bulunamadı.</p></div>
    </>
  )

  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Randevu Detayı</h1>
            <p className="page-subtitle">{new Date(data.appointmentDate).toLocaleString('tr-TR')}</p>
          </div>
          <Link href="/doktor/dashboard" className="btn btn-secondary btn-sm">← Geri Dön</Link>
        </div>
      </div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Hasta Bilgileri */}
          <div className="card">
            <div className="card-header"><h3 className="card-title">👤 Hasta Bilgileri</h3></div>
            {[
              ['Ad Soyad', data.patient?.fullName],
              ['E-posta', data.patient?.email],
              ['Telefon', data.patient?.phone || '—'],
              ['Randevu Tarihi', new Date(data.appointmentDate).toLocaleString('tr-TR')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 120, flexShrink: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)' }}>{k}</span>
                <span style={{ fontSize: '0.875rem' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Durum Yönetimi */}
          <div className="card">
            <div className="card-header"><h3 className="card-title">⚙️ Durum Yönetimi</h3></div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>MEVCUT DURUM</span>
              <div style={{ marginTop: 8 }}>
                <span className={`badge badge-${data.status}`} style={{ fontSize: '0.875rem', padding: '6px 14px' }}>
                  {STATUS_MAP[data.status]}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.status === 'beklemede' && (
                <>
                  <button className="btn btn-success" onClick={() => updateStatus('onaylandi')} disabled={updating}>✓ Onayla</button>
                  <button className="btn btn-danger" onClick={() => updateStatus('iptal')} disabled={updating}>✗ İptal Et</button>
                </>
              )}
              {data.status === 'onaylandi' && (
                <>
                  <button className="btn btn-primary" onClick={() => updateStatus('tamamlandi')} disabled={updating}>🏁 Tamamlandı İşaretle</button>
                  <button className="btn btn-danger" onClick={() => updateStatus('iptal')} disabled={updating}>✗ İptal Et</button>
                </>
              )}
              {(data.status === 'iptal' || data.status === 'tamamlandi') && (
                <p className="text-muted text-sm">Bu randevu için başka işlem yapılamaz.</p>
              )}
            </div>
          </div>
        </div>

        {/* Anamnez Formu */}
        {data.anamnez && (
          <div className="card" style={{ marginTop: 20 }}>
            <div className="card-header">
              <h3 className="card-title">📋 Anamnez Formu</h3>
              <p className="text-muted text-sm" style={{ marginTop: 4 }}>
                <strong>Neden:</strong> {data.anamnez.reason} | <strong>Yaş Grubu:</strong> {data.anamnez.ageGroup}
              </p>
            </div>
            
            {(!data.anamnez.formData || Object.keys(data.anamnez.formData).length === 0) ? (
              <p className="text-muted" style={{ padding: '10px 0' }}>Doldurulmuş form sorusu bulunmuyor.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {getQuestionsFor(data.anamnez.reason, data.anamnez.ageGroup).map((q, idx) => {
                  let answer;
                  try {
                    const parsedForm = typeof data.anamnez.formData === 'string' ? JSON.parse(data.anamnez.formData) : data.anamnez.formData;
                    answer = parsedForm[q.id];
                  } catch(e) { answer = null }
                  if (!answer) return null
                  return (
                    <div key={q.id}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)', marginBottom: 6 }}>
                        {idx + 1}. {q.text}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text)', background: 'var(--surface)', padding: '10px 14px', borderRadius: 8, lineHeight: 1.6 }}>
                        {answer}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
