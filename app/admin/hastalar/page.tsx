'use client'
import { useEffect, useState } from 'react'

export default function AdminHastalar() {
  const [hastalar, setHastalar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  function refresh() {
    fetch('/api/admin/users').then(r => r.json()).then((users) => {
      if (Array.isArray(users)) {
        // Sadece hasta rolündeki kullanıcıları filtrele
        setHastalar(users.filter(u => u.role === 'hasta'))
      }
      setLoading(false)
    })
  }

  useEffect(refresh, [])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Hastalar</h1>
        <p className="page-subtitle">Sisteme kayıtlı tüm hastaları görüntüleyin.</p>
      </div>
      <div className="page-body">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Kayıtlı Hastalar ({hastalar.length})</div>
          {loading ? (
            <p style={{ padding: 16 }} className="text-muted">Yükleniyor…</p>
          ) : hastalar.length === 0 ? (
            <p style={{ padding: 16 }} className="text-muted">Sistemde henüz kayıtlı hasta bulunmuyor.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>Ad Soyad</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>E-posta</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>Telefon</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {hastalar.map(h => (
                    <tr key={h.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 20px', fontWeight: 500 }}>{h.fullName}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--text-2)' }}>{h.email}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--text-2)' }}>{h.phone || '-'}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--text-2)' }}>{new Date(h.createdAt).toLocaleDateString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
