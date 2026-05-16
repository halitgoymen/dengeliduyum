'use client'
import { useEffect, useState } from 'react'

export default function AdminKullanicilar() {
  const [kullanicilar, setKullanicilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  function refresh() {
    fetch('/api/admin/users').then(r => r.json()).then((users) => {
      if (Array.isArray(users)) {
        // Tüm kullanıcıları göster
        setKullanicilar(users)
      }
      setLoading(false)
    })
  }

  useEffect(refresh, [])

  const roleColors: any = {
    admin: { bg: '#fee2e2', text: '#991b1b', label: 'Admin' },
    doktor: { bg: '#dbeafe', text: '#1e40af', label: 'Doktor' },
    hasta: { bg: '#dcfce7', text: '#166534', label: 'Hasta' }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Tüm Kullanıcılar</h1>
        <p className="page-subtitle">Sisteme kayıtlı tüm kullanıcıları (Admin, Doktor, Hasta) görüntüleyin.</p>
      </div>
      <div className="page-body">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Kayıtlı Kullanıcılar ({kullanicilar.length})</div>
          {loading ? (
            <p style={{ padding: 16 }} className="text-muted">Yükleniyor…</p>
          ) : kullanicilar.length === 0 ? (
            <p style={{ padding: 16 }} className="text-muted">Sistemde henüz kayıtlı kullanıcı bulunmuyor.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>Ad Soyad</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>Rol</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>E-posta</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>Telefon</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {kullanicilar.map(u => {
                    const r = roleColors[u.role] || roleColors['hasta']
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 20px', fontWeight: 500 }}>{u.fullName}</td>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, backgroundColor: r.bg, color: r.text }}>
                            {r.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 20px', color: 'var(--text-2)' }}>{u.email}</td>
                        <td style={{ padding: '12px 20px', color: 'var(--text-2)' }}>{u.phone || '-'}</td>
                        <td style={{ padding: '12px 20px', color: 'var(--text-2)' }}>{new Date(u.createdAt).toLocaleString('tr-TR')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
