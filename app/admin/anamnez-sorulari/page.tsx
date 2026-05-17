'use client'
import { useState, useEffect } from 'react'

const KATEGORILER = [
  'İşitme azlığı/ kaybı',
  'Çınlama (Tinnitus) Terapisi',
  'Denge (Vestibüler) Rehabilitasyon',
  'Mesleki ve Periyodik İşitme Taraması',
  'Çocuk randevusu (ebeveyn girişi)',
]

const YAS_GRUPLARI = [
  { value: 'tum', label: 'Tüm Yaş Grupları' },
  { value: '0-18 yaş', label: '0–18 Yaş' },
  { value: '18-65 yaş', label: '18–65 Yaş' },
  { value: '65 yaş ve üzeri', label: '65 Yaş ve Üzeri' },
]

type Soru = {
  id: string
  kategori: string
  yasGrubu: string
  soru: string
  secenekler: string[]
  sira: number
  aktif: boolean
  createdAt: string
  hastaTipi?: string
  bagliSoruId?: string | null
  bagliCevap?: string | null
  uyariMesaji?: string | null
}

const EMPTY_FORM = {
  id: '',
  kategori: KATEGORILER[0],
  yasGrubu: 'tum',
  soru: '',
  secenekler: ['', ''],
  sira: 0,
  aktif: true,
  hastaTipi: 'tum',
  bagliSoruId: '',
  bagliCevap: '',
  uyariMesaji: '',
}

export default function AnamnezSorulariPage() {
  const [sorular, setSorular] = useState<Soru[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })

  const [filterKategori, setFilterKategori] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/anamnez-sorulari')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error + (data.details ? ` (${data.details})` : ''))
      setSorular(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e.message || 'Sorular yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm({ ...EMPTY_FORM })
    setEditingId(null)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  function openEdit(s: Soru) {
    setForm({
      id: s.id,
      kategori: s.kategori,
      yasGrubu: s.yasGrubu,
      soru: s.soru,
      secenekler: [...s.secenekler],
      sira: s.sira,
      aktif: s.aktif,
      hastaTipi: s.hastaTipi || 'tum',
      bagliSoruId: s.bagliSoruId || '',
      bagliCevap: s.bagliCevap || '',
      uyariMesaji: s.uyariMesaji || '',
    })
    setEditingId(s.id)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
  }

  function addOption() {
    setForm(p => ({ ...p, secenekler: [...p.secenekler, ''] }))
  }

  function removeOption(idx: number) {
    setForm(p => ({ ...p, secenekler: p.secenekler.filter((_, i) => i !== idx) }))
  }

  function updateOption(idx: number, val: string) {
    setForm(p => {
      const s = [...p.secenekler]
      s[idx] = val
      return { ...p, secenekler: s }
    })
  }

  async function handleSave() {
    setError('')
    const cleanSecenekler = form.secenekler.map(s => s.trim()).filter(Boolean)
    if (!form.soru.trim()) { setError('Soru metni boş olamaz.'); return }
    if (cleanSecenekler.length < 2) { setError('En az 2 seçenek girilmelidir.'); return }

    setSaving(true)
    try {
      const payload = {
        kategori: form.kategori,
        yasGrubu: form.yasGrubu,
        soru: form.soru.trim(),
        secenekler: cleanSecenekler,
        sira: Number(form.sira) || 0,
        aktif: form.aktif,
        hastaTipi: form.hastaTipi,
        bagliSoruId: form.bagliSoruId || null,
        bagliCevap: form.bagliCevap || null,
        uyariMesaji: form.uyariMesaji || null,
      }

      let res: Response
      if (editingId) {
        res = await fetch(`/api/admin/anamnez-sorulari?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/admin/anamnez-sorulari', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (!res.ok) { setError(data.error + (data.details ? ` \nDetay: ${data.details}` : '')); return }

      setSuccess(editingId ? 'Soru güncellendi.' : 'Yeni soru eklendi.')
      closeForm()
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, soruText: string) {
    if (!confirm(`"${soruText.slice(0, 60)}…" sorusunu silmek istediğinizden emin misiniz?`)) return
    try {
      const res = await fetch(`/api/admin/anamnez-sorulari?id=${id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Silinemedi.'); return }
      setSuccess('Soru silindi.')
      await load()
    } catch {
      setError('Silme işlemi başarısız.')
    }
  }

  async function toggleAktif(s: Soru) {
    await fetch(`/api/admin/anamnez-sorulari?id=${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kategori: s.kategori,
        yasGrubu: s.yasGrubu,
        soru: s.soru,
        secenekler: s.secenekler,
        sira: s.sira,
        aktif: !s.aktif,
        hastaTipi: s.hastaTipi,
        bagliSoruId: s.bagliSoruId,
        bagliCevap: s.bagliCevap,
        uyariMesaji: s.uyariMesaji,
      }),
    })
    await load()
  }

  const filtered = filterKategori
    ? sorular.filter(s => s.kategori === filterKategori)
    : sorular

  // Group by kategori for display
  const groups = KATEGORILER.map(k => ({
    kategori: k,
    sorular: filtered.filter(s => s.kategori === k),
  })).filter(g => g.sorular.length > 0 || !filterKategori)

  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Anamnez Soruları</h1>
            <p className="page-subtitle">Randevu formundaki anamnez sorularını yönetin. Admin'den eklenen sorular hastalara gösterilir.</p>
          </div>
          <button className="btn btn-primary" onClick={openNew} id="btn-yeni-soru">
            ＋ Yeni Soru Ekle
          </button>
        </div>
      </div>

      <div className="page-body">
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>{success}</div>}

        {/* Filtre */}
        <div className="card" style={{ marginBottom: 20, padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-2)' }}>Kategoriye Göre Filtrele:</span>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: 260 }}
              value={filterKategori}
              onChange={e => setFilterKategori(e.target.value)}
            >
              <option value="">— Tüm Kategoriler —</option>
              {KATEGORILER.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--text-3)' }}>
              Toplam: <strong>{filtered.length}</strong> soru
            </span>
          </div>
        </div>

        {/* Soru Ekleme / Düzenleme Formu */}
        {showForm && (
          <div className="card" style={{ marginBottom: 24, border: '2px solid var(--accent)', background: 'var(--accent-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>
                {editingId ? '✏️ Soruyu Düzenle' : '➕ Yeni Soru Ekle'}
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={closeForm}>✕ İptal</button>
            </div>

            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Kategori *</label>
                <select className="form-select" value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}>
                  {KATEGORILER.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Yaş Grubu</label>
                <select className="form-select" value={form.yasGrubu} onChange={e => setForm(p => ({ ...p, yasGrubu: e.target.value }))}>
                  {YAS_GRUPLARI.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Soru Metni *</label>
              <textarea
                className="form-textarea"
                placeholder="Örn: Karşılıklı konuşmaları anlamada zorluk yaşıyor musunuz?"
                value={form.soru}
                onChange={e => setForm(p => ({ ...p, soru: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Seçenekler * <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(en az 2)</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.secenekler.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Seçenek ${idx + 1}`}
                      value={opt}
                      onChange={e => updateOption(idx, e.target.value)}
                      style={{ marginBottom: 0 }}
                    />
                    {form.secenekler.length > 2 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeOption(idx)} title="Seçeneği kaldır">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addOption} style={{ marginTop: 8 }}>
                + Seçenek Ekle
              </button>
            </div>

            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sıra No</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  value={form.sira}
                  onChange={e => setForm(p => ({ ...p, sira: Number(e.target.value) }))}
                />
                <span className="form-hint">Küçük sayı = önce göster</span>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Durum</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 11, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.aktif}
                    onChange={e => setForm(p => ({ ...p, aktif: e.target.checked }))}
                    style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>Aktif (hastalara göster)</span>
                </label>
              </div>
            </div>

            {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Kaydediliyor…' : editingId ? '💾 Güncelle' : '✅ Soruyu Kaydet'}
              </button>
              <button className="btn btn-secondary" onClick={closeForm}>İptal</button>
            </div>
          </div>
        )}

        {/* Soru Listesi */}
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p>Yükleniyor…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>Henüz soru eklenmemiş.</p>
            <button className="btn btn-primary" onClick={openNew} style={{ marginTop: 16 }}>İlk soruyu ekle</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {KATEGORILER.map(kategori => {
              const ks = filtered.filter(s => s.kategori === kategori)
              if (ks.length === 0) return null
              return (
                <div key={kategori} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.1rem' }}>📋</span>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{kategori}</h3>
                    <span className="badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{ks.length} soru</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {ks.map((s, idx) => (
                      <div key={s.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 16,
                        padding: '14px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        background: s.aktif ? 'var(--bg)' : 'var(--surface)',
                        opacity: s.aktif ? 1 : 0.6,
                      }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: 6 }}>{s.soru}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {s.secenekler.map((opt: string) => (
                              <span key={opt} style={{ fontSize: '0.775rem', padding: '2px 10px', borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>{opt}</span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 8, fontSize: '0.775rem', color: 'var(--text-3)' }}>
                            <span>{YAS_GRUPLARI.find(y => y.value === s.yasGrubu)?.label}</span>
                            <span>·</span>
                            <span>Sıra: {s.sira}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button
                            className="btn btn-sm"
                            style={{ background: s.aktif ? 'var(--success-light)' : 'var(--warning-light)', color: s.aktif ? 'var(--success)' : '#92400E', border: 'none' }}
                            onClick={() => toggleAktif(s)}
                            title={s.aktif ? 'Pasif yap' : 'Aktif yap'}
                          >
                            {s.aktif ? '✓ Aktif' : '○ Pasif'}
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, s.soru)}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
