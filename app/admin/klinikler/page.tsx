'use client'
import { useEffect, useState } from 'react'

export default function AdminKlinikler() {
  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cForm, setCForm] = useState({ name: '', address: '' })
  const [savingC, setSavingC] = useState(false)

  function refresh() {
    fetch('/api/admin/clinics').then(r => r.json()).then((c) => {
      setClinics(Array.isArray(c) ? c : [])
      setLoading(false)
    })
  }
  useEffect(refresh, [])

  async function addClinic(e: React.FormEvent) {
    e.preventDefault(); setSavingC(true)
    await fetch('/api/admin/clinics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cForm) })
    setCForm({ name: '', address: '' }); refresh(); setSavingC(false)
  }

  async function delClinic(id: string) {
    if (!confirm('Bu kliniği silmek istediğinizden emin misiniz?')) return
    const res = await fetch(`/api/admin/clinics?id=${id}`, { method: 'DELETE' })
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
        <h1 className="page-title">Klinik Yönetimi</h1>
        <p className="page-subtitle">Klinik şubelerini ekleyin, düzenleyin.</p>
      </div>
      <div className="page-body">
        <div style={{ maxWidth: 600 }}>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>🏥 Yeni Klinik Ekle</h3>
            <form onSubmit={addClinic}>
              <div className="form-group">
                <label className="form-label">Klinik Adı *</label>
                <input className="form-input" value={cForm.name} onChange={e => setCForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Adres</label>
                <input className="form-input" value={cForm.address} onChange={e => setCForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={savingC}>{savingC ? 'Ekleniyor…' : '+ Ekle'}</button>
            </form>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Klinikler ({clinics.length})</div>
            {loading ? <p style={{ padding: 16 }} className="text-muted">Yükleniyor…</p> : clinics.length === 0 ? (
              <p style={{ padding: 16 }} className="text-muted">Henüz klinik yok.</p>
            ) : clinics.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="font-semibold text-sm">{c.name}</div>
                  {c.address && <div className="text-xs text-muted">{c.address}</div>}
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => delClinic(c.id)}>Sil</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
