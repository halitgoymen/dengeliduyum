'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { REASONS, AGE_GROUPS, getQuestionsFor } from '@/lib/form-questions'

type Step = 'klinik' | 'neden' | 'yas' | 'doktor' | 'tarih' | 'anamnez' | 'onay'

const STEPS: { id: Step; label: string }[] = [
  { id: 'klinik',  label: 'Klinik' },
  { id: 'neden',   label: 'Neden' },
  { id: 'yas',     label: 'Yaş' },
  { id: 'doktor',  label: 'Doktor' },
  { id: 'tarih',   label: 'Tarih' },
  { id: 'anamnez', label: 'Anamnez' },
  { id: 'onay',    label: 'Onay' },
]

const STEP_ORDER: Step[] = ['klinik', 'neden', 'yas', 'doktor', 'tarih', 'anamnez', 'onay']

export default function HastaDashboard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('klinik')
  const stepIdx = STEP_ORDER.indexOf(step)

  const [clinics, setClinics] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])

  const [sel, setSel] = useState({ clinicId: '', reason: '', ageGroup: '', doctorId: '', tarih: '' })
  const [formData, setFormData] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetch('/api/clinics').then(r => r.json()).then(setClinics) }, [])
  useEffect(() => {
    if (!sel.clinicId) return
    fetch(`/api/doctors?clinicId=${sel.clinicId}`).then(r => r.json()).then(setDoctors)
  }, [sel.clinicId])

  function next() { setStep(STEP_ORDER[stepIdx + 1]) }
  function back() { setStep(STEP_ORDER[stepIdx - 1]) }

  async function submit() {
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: sel.doctorId,
          clinicId: sel.clinicId,
          appointmentDate: sel.tarih,
          reason: sel.reason,
          ageGroup: sel.ageGroup,
          formData,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Hata'); return }
      router.push('/hasta/randevularim')
    } finally { setLoading(false) }
  }

  const selClinic = clinics.find(c => c.id === sel.clinicId)
  const selDoctor = doctors.find(d => d.id === sel.doctorId)

  const questions = getQuestionsFor(sel.reason, sel.ageGroup)

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Randevu Al</h1>
        <p className="page-subtitle">Adımları takip ederek randevunuzu oluşturun.</p>
      </div>
      <div className="page-body">
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s.id} className="step-item">
              <div className={`step-circle${step === s.id ? ' active' : i < stepIdx ? ' done' : ''}`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className={`step-label${step === s.id ? ' active' : ''}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error">{error}</div>}

          {step === 'klinik' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Klinik Şubesi Seçin</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {clinics.map(c => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1.5px solid ${sel.clinicId === c.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: sel.clinicId === c.id ? 'var(--accent-light)' : 'var(--bg)' }}>
                    <input type="radio" name="clinic" value={c.id} checked={sel.clinicId === c.id} onChange={() => setSel(p => ({ ...p, clinicId: c.id, doctorId: '' }))} style={{ accentColor: 'var(--accent)' }} />
                    <div><div className="font-semibold">{c.name}</div><div className="text-xs text-muted">{c.address}</div></div>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 24 }}><button className="btn btn-primary" onClick={next} disabled={!sel.clinicId}>Devam Et</button></div>
            </div>
          )}

          {step === 'neden' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Takip Nedeni</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REASONS.map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1.5px solid ${sel.reason === r ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: sel.reason === r ? 'var(--accent-light)' : 'var(--bg)' }}>
                    <input type="radio" name="reason" value={r} checked={sel.reason === r} onChange={() => setSel(p => ({ ...p, reason: r }))} style={{ accentColor: 'var(--accent)' }} />
                    <span className="font-semibold">{r}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={back}>Geri</button>
                <button className="btn btn-primary" onClick={next} disabled={!sel.reason}>Devam Et</button>
              </div>
            </div>
          )}

          {step === 'yas' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Yaş Grubu Seçimi</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {AGE_GROUPS.map(a => (
                  <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1.5px solid ${sel.ageGroup === a ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: sel.ageGroup === a ? 'var(--accent-light)' : 'var(--bg)' }}>
                    <input type="radio" name="age" value={a} checked={sel.ageGroup === a} onChange={() => setSel(p => ({ ...p, ageGroup: a }))} style={{ accentColor: 'var(--accent)' }} />
                    <span className="font-semibold">{a}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={back}>Geri</button>
                <button className="btn btn-primary" onClick={next} disabled={!sel.ageGroup}>Devam Et</button>
              </div>
            </div>
          )}

          {step === 'doktor' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Odyolog / Doktor Seçin</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {doctors.map(d => (
                  <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1.5px solid ${sel.doctorId === d.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: sel.doctorId === d.id ? 'var(--accent-light)' : 'var(--bg)' }}>
                    <input type="radio" name="doctor" value={d.id} checked={sel.doctorId === d.id} onChange={() => setSel(p => ({ ...p, doctorId: d.id }))} style={{ accentColor: 'var(--accent)' }} />
                    <span className="font-semibold">{d.title} {d.fullName}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={back}>Geri</button>
                <button className="btn btn-primary" onClick={next} disabled={!sel.doctorId}>Devam Et</button>
              </div>
            </div>
          )}

          {step === 'tarih' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Tarih Seçin</h2>
              <div className="form-group">
                <input type="datetime-local" className="form-input" min={new Date().toISOString().slice(0, 16)} value={sel.tarih} onChange={e => setSel(p => ({ ...p, tarih: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={back}>Geri</button>
                <button className="btn btn-primary" onClick={next} disabled={!sel.tarih}>Devam Et</button>
              </div>
            </div>
          )}

          {step === 'anamnez' && (
            <div>
              <h2 style={{ marginBottom: 16 }}>Anamnez Formu</h2>
              {questions.length === 0 ? (
                <p className="text-muted">Bu seçim için ek soru bulunmamaktadır.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {questions.map((q, idx) => (
                    <div key={q.id}>
                      <div style={{ fontWeight: 500, marginBottom: 8, fontSize: '0.9rem' }}>{idx + 1}. {q.text}</div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {q.options.map(opt => (
                          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                            <input type="radio" name={q.id} value={opt} checked={formData[q.id] === opt} onChange={() => setFormData(p => ({ ...p, [q.id]: opt }))} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={back}>Geri</button>
                <button className="btn btn-primary" onClick={next} disabled={questions.length > 0 && Object.keys(formData).length < questions.length}>Devam Et</button>
              </div>
            </div>
          )}

          {step === 'onay' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Randevu Özeti</h2>
              <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
                {[
                  ['Klinik', selClinic?.name],
                  ['Neden', sel.reason],
                  ['Yaş', sel.ageGroup],
                  ['Doktor', `${selDoctor?.title} ${selDoctor?.fullName}`],
                  ['Tarih', sel.tarih ? new Date(sel.tarih).toLocaleString('tr-TR') : ''],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ width: 80, flexShrink: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)' }}>{k}</span>
                    <span style={{ fontSize: '0.9rem' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" onClick={back} disabled={loading}>Geri</button>
                <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Bekleyin…' : 'Onayla'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
