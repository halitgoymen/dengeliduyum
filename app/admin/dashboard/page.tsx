'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, doctors: 0, clinics: 0, appointments: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/admin/doctors').then(r => r.json()),
      fetch('/api/admin/clinics').then(r => r.json()),
      fetch('/api/appointments').then(r => r.json()),
    ]).then(([u, d, h, a]) => {
      setStats({
        users: Array.isArray(u) ? u.length : 0,
        doctors: Array.isArray(d) ? d.length : 0,
        clinics: Array.isArray(h) ? h.length : 0,
        appointments: Array.isArray(a) ? a.length : 0,
      })
    })
      })
    })
  }, [])

  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Yönetim Paneli</h1>
            <p className="page-subtitle">Sistem genelindeki istatistikler ve hızlı erişim</p>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          {[
            { icon: '👥', value: stats.users, label: 'Toplam Kullanıcı' },
            { icon: '👨‍⚕️', value: stats.doctors, label: 'Kayıtlı Doktor' },
            { icon: '🏥', value: stats.clinics, label: 'Klinik' },
            { icon: '📅', value: stats.appointments, label: 'Toplam Randevu' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { href: '/admin/doktorlar', icon: '👨‍⚕️', title: 'Doktor Yönetimi', desc: 'Yeni doktor ekle, mevcut doktorları görüntüle.' },
            { href: '/admin/klinikler', icon: '🏥', title: 'Klinik Yönetimi', desc: 'Şube ekle, düzenle, sil.' },
            { href: '/admin/kullanicilar', icon: '🧑‍🤝‍🧑', title: 'Tüm Kullanıcılar', desc: 'Sisteme kayıtlı admin, doktor ve hastaları görüntüle.' },
            { href: '/admin/randevular', icon: '📅', title: 'Tüm Randevular', desc: 'Sistem genelindeki tüm randevuları görüntüle.' },
            { href: '/admin/loglar', icon: '📋', title: 'Sistem Logları', desc: 'Son olayları ve aktiviteleri incele.' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="card" style={{ textDecoration: 'none', display: 'block', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}>
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p className="text-sm text-muted" style={{ marginTop: 4 }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
