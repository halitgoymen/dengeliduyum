'use client'
import { useEffect, useState } from 'react'

export default function AdminDoktorlar() {
  const [doctors, setDoctors]   = useState<any[]>([])
  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', title: 'Odyolog', clinicId: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')

  function refresh() {
    Promise.all([
      fetch('/api/admin/doctors').then(r => r.json()),
      fetch('/api/admin/clinics').then(r => r.json()),
    ]).then(([d, h]) => { setDoctors(Array.isArray(d) ? d : []); setClinics(Array.isArray(h) ? h : []); setLoading(false) })
  }

  useEffect(refresh, [])

  function upd(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess(''); setSaving(true)
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Hata oluştu'); return }
      setSuccess('Doktor başarıyla oluşturuldu.')
      setForm({ fullName: '', email: '', password: '', phone: '', title: 'Odyolog', clinicId: '' })
      setShowForm(false); refresh()
    } finally { setSaving(false) }
  }

  async function delDoctor(id: string) {
    if (!confirm('Bu doktoru silmek istediğinizden emin misiniz?')) return
    const res = await fetch(`/api/admin/doctors?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || 'Silinirken hata oluştu.')
    } else {
      refresh()
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Doktorlar</h1>
            <p className="page-subtitle">Doktor hesaplarını yönetin</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowForm(s => !s); setError(''); setSuccess('') }}>
            {showForm ? 'İptal' : '+ Yeni Doktor'}
          </button>
        </div>
      </div>
      <div className="page-body">
        {success && <div className="alert alert-success">{success}</div>}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Yeni Doktor Oluştur</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleCreate}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Ad Soyad *</label>
                  <input className="form-input" value={form.fullName} onChange={e => upd('fullName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Unvan</label>
                  <select className="form-select" value={form.title} onChange={e => upd('title', e.target.value)}>
                    {['Odyolog', 'Uzm. Odyolog', 'Dr. Odyolog', 'Prof. Dr.'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">E-posta *</label>
                  <input type="email" className="form-input" value={form.email} onChange={e => upd('email', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Şifre *</label>
                  <input type="password" className="form-input" value={form.password} onChange={e => upd('password', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Klinik *</label>
                  <select className="form-select" value={form.clinicId} onChange={e => upd('clinicId', e.target.value)} required>
                    <option value="">Klinik seçin</option>
                    {clinics.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Kaydediliyor…' : 'Doktor Oluştur'}</button>
            </form>
          </div>
        )}

        {loading ? <p className="text-muted">Yükleniyor…</p> : doctors.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">👨‍⚕️</div><h3>Henüz doktor yok</h3></div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Kayıt Tarihi</th><th>İşlem</th></tr></thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d.id}>
                      <td><div className="font-semibold">{d.title} {d.fullName}</div></td>
                      <td className="text-muted">{d.email}</td>
                      <td className="text-muted text-sm">{new Date(d.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => delDoctor(d.id)}>Sil</button>
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
