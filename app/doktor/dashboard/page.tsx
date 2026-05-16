'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUS_MAP: Record<string, string> = {
  beklemede: 'Beklemede', onaylandi: 'Onaylandı', iptal: 'İptal', tamamlandi: 'Tamamlandı',
}

export default function DoktorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/appointments').then(r => r.json()).then(data => {
      setAppointments(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const counts = {
    beklemede: appointments.filter(a => a.status === 'beklemede').length,
    onaylandi: appointments.filter(a => a.status === 'onaylandi').length,
    tamamlandi: appointments.filter(a => a.status === 'tamamlandi').length,
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Randevularım</h1>
        <p className="page-subtitle">Gelen randevuları inceleyin ve yönetin.</p>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{counts.beklemede}</div>
            <div className="stat-label">Bekleyen Randevu</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{counts.onaylandi}</div>
            <div className="stat-label">Onaylanan</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏁</div>
            <div className="stat-value">{counts.tamamlandi}</div>
            <div className="stat-label">Tamamlanan</div>
          </div>
        </div>

        {loading ? <p className="text-muted">Yükleniyor…</p> : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>Henüz randevu bulunmuyor</h3>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Hasta</th><th>Telefon</th><th>Tarih & Saat</th><th>Durum</th><th>Detay</th></tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td><div className="font-semibold">{a.patientName}</div></td>
                      <td className="text-muted">{a.patientPhone || '—'}</td>
                      <td>{new Date(a.appointmentDate).toLocaleString('tr-TR')}</td>
                      <td><span className={`badge badge-${a.status}`}>{STATUS_MAP[a.status]}</span></td>
                      <td>
                        <Link href={`/doktor/randevu/${a.id}`} className="btn btn-secondary btn-sm">İncele</Link>
                      </td>
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
