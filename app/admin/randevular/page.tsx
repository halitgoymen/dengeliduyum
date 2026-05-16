'use client'
import { useEffect, useState } from 'react'

const STATUS_MAP: Record<string, string> = {
  beklemede: 'Beklemede', onaylandi: 'Onaylandı', iptal: 'İptal', tamamlandi: 'Tamamlandı',
}

export default function AdminRandevular() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('hepsi')

  useEffect(() => {
    fetch('/api/appointments').then(r => r.json()).then(data => {
      setAppointments(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'hepsi' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Tüm Randevular</h1>
        <p className="page-subtitle">Sistem genelindeki randevuların listesi</p>
      </div>
      <div className="page-body">
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['hepsi', 'beklemede', 'onaylandi', 'tamamlandi', 'iptal'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
              {s === 'hepsi' ? 'Tümü' : STATUS_MAP[s]}
              {' '}({s === 'hepsi' ? appointments.length : appointments.filter(a => a.status === s).length})
            </button>
          ))}
        </div>

        {loading ? <p className="text-muted">Yükleniyor…</p> : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📭</div><h3>Randevu bulunamadı</h3></div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Hasta</th><th>Tarih & Saat</th><th>Durum</th><th>Kayıt Tarihi</th></tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td><div className="font-semibold">{a.patientName}</div></td>
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
