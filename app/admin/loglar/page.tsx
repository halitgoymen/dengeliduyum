'use client'
import { useEffect, useState } from 'react'

export default function AdminSistemLoglari() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()).catch(() => []),
      fetch('/api/admin/doctors').then(r => r.json()).catch(() => []),
      fetch('/api/admin/clinics').then(r => r.json()).catch(() => []),
      fetch('/api/appointments').then(r => r.json()).catch(() => []),
    ]).then(([users, doctors, clinics, appointments]) => {
      let combinedLogs: any[] = []

      if (Array.isArray(users)) {
        users.forEach(u => {
          combinedLogs.push({
            id: 'u_' + u.id,
            type: 'user',
            title: 'Yeni Kullanıcı Kaydı',
            desc: `${u.fullName} sisteme ${u.role} rolüyle kayıt oldu.`,
            date: new Date(u.createdAt)
          })
        })
      }

      if (Array.isArray(doctors)) {
        doctors.forEach(d => {
          combinedLogs.push({
            id: 'd_' + d.id,
            type: 'doctor',
            title: 'Yeni Doktor Ataması',
            desc: `${d.user?.fullName || 'Bir doktor'} kliniğe eklendi.`,
            date: new Date(d.createdAt)
          })
        })
      }

      if (Array.isArray(clinics)) {
        clinics.forEach(c => {
          combinedLogs.push({
            id: 'c_' + c.id,
            type: 'clinic',
            title: 'Yeni Klinik Şubesi',
            desc: `${c.name} adlı yeni klinik şubesi açıldı.`,
            date: new Date(c.createdAt)
          })
        })
      }

      if (Array.isArray(appointments)) {
        appointments.forEach(a => {
          combinedLogs.push({
            id: 'a_' + a.id,
            type: 'appointment',
            title: 'Yeni Randevu Talebi',
            desc: `${a.patient?.fullName || 'Bir hasta'}, ${a.doctor?.user?.fullName || 'bir doktordan'} randevu aldı. Durum: ${a.status}`,
            date: new Date(a.createdAt)
          })
        })
      }

      // Tarihe göre yeniden eskiye sırala
      combinedLogs.sort((a, b) => b.date.getTime() - a.date.getTime())
      setLogs(combinedLogs)
      setLoading(false)
    })
  }, [])

  const logIcons: any = {
    user: '👤',
    doctor: '👨‍⚕️',
    clinic: '🏥',
    appointment: '📅'
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Sistem Logları</h1>
        <p className="page-subtitle">Sistemde gerçekleşen son olaylar ve aktivite geçmişi.</p>
      </div>
      <div className="page-body">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Son Aktiviteler</div>
          {loading ? (
            <p style={{ padding: 16 }} className="text-muted">Loglar yükleniyor…</p>
          ) : logs.length === 0 ? (
            <p style={{ padding: 16 }} className="text-muted">Henüz sistemde bir aktivite bulunmuyor.</p>
          ) : (
            <div>
              {logs.map((log, index) => (
                <div key={log.id} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: index === logs.length - 1 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.5rem' }}>{logIcons[log.type]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{log.title}</div>
                    <div style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginTop: 4 }}>{log.desc}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginTop: 8 }}>{log.date.toLocaleString('tr-TR')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
