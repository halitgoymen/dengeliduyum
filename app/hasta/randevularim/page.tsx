'use client'
import { useEffect, useState } from 'react'

const STATUS_MAP: Record<string, string> = {
  beklemede: 'Beklemede', onaylandi: 'Onaylandı', iptal: 'İptal', tamamlandi: 'Tamamlandı',
}

export default function RandevularimPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/appointments').then(r => r.json()).then(data => {
      setAppointments(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <>
      <div className="page-header"><h1 className="page-title">Randevularım</h1></div>
      <div className="page-body"><p className="text-muted">Yükleniyor…</p></div>
    </>
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Randevularım</h1>
        <p className="page-subtitle">Geçmiş ve mevcut randevularınızın listesi</p>
      </div>
      <div className="page-body">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>Henüz randevunuz yok</h3>
            <p style={{ marginTop: 8 }}>Randevu almak için sol menüden "Randevu Al"ı tıklayın.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Doktor</th>
                    <th>Tarih & Saat</th>
                    <th>Durum</th>
                    <th>Oluşturulma</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td>
                        <div className="font-semibold">{a.doctorTitle} {a.doctorName}</div>
                      </td>
                      <td>{new Date(a.appointmentDate).toLocaleString('tr-TR')}</td>
                      <td><span className={`badge badge-${a.status}`}>{STATUS_MAP[a.status]}</span></td>
                      <td className="text-muted text-sm">{new Date(a.createdAt).toLocaleDateString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
