'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { REASONS, AGE_GROUPS } from '@/lib/form-questions'

type Step = 'klinik' | 'hasta_tipi' | 'yas' | 'neden' | 'doktor' | 'tarih' | 'anamnez' | 'onay'

const STEPS: { id: Step; label: string }[] = [
  { id: 'klinik',  label: 'Klinik' },
  { id: 'hasta_tipi', label: 'Randevu Türü' },
  { id: 'yas',     label: 'Yaş' },
  { id: 'neden',   label: 'Neden' },
  { id: 'doktor',  label: 'Doktor' },
  { id: 'tarih',   label: 'Tarih' },
  { id: 'anamnez', label: 'Anamnez' },
  { id: 'onay',    label: 'Onay' },
]

type DBSoru = {
  id: string
  soru: string
  secenekler: string[]
  yasGrubu: string
  hastaTipi: string
  bagliSoruId: string | null
  bagliCevap: string | null
  uyariMesaji: string | null
  sira: number
}

type Question = { 
  id: string; 
  text: string; 
  options: string[]; 
  type: string;
  bagliSoruId: string | null;
  bagliCevap: string | null;
  uyariMesaji: Record<string, string> | null;
}

export default function HastaDashboard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('klinik')
  
  const [clinics, setClinics] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])

  const [sel, setSel] = useState({ clinicId: '', hastaTipi: '', reason: '', ageGroup: '', doctorId: '', tarih: '' })
  const [formData, setFormData] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [dbQuestions, setDbQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)

  // Aktif adımları belirleme (Neden adımı Yeni Hastalarda atlanıyor)
  const activeSteps = STEPS.filter(s => {
    if (s.id === 'neden' && sel.hastaTipi === 'yeni') return false;
    return true;
  })
  
  const stepIdx = activeSteps.findIndex(s => s.id === step)

  useEffect(() => { fetch('/api/clinics').then(r => r.json()).then(setClinics) }, [])
  useEffect(() => {
    if (!sel.clinicId) return
    fetch(`/api/doctors?clinicId=${sel.clinicId}`).then(r => r.json()).then(setDoctors)
  }, [sel.clinicId])

  // Anamnez adımına geçince soruları çek
  useEffect(() => {
    if (step !== 'anamnez' || !sel.reason || !sel.ageGroup || !sel.hastaTipi) return
    setQuestionsLoading(true)
    fetch(`/api/anamnez-sorulari?kategori=${encodeURIComponent(sel.reason)}&yasGrubu=${encodeURIComponent(sel.ageGroup)}&hastaTipi=${encodeURIComponent(sel.hastaTipi)}`)
      .then(r => r.json())
      .then((data: DBSoru[]) => {
        if (Array.isArray(data)) {
          setDbQuestions(data.map(s => {
            let optionsArray: string[] = []
            if (Array.isArray(s.secenekler)) {
              optionsArray = s.secenekler
            } else if (typeof s.secenekler === 'string') {
              try { optionsArray = JSON.parse(s.secenekler) } catch { optionsArray = [] }
            }

            let warningsObj: Record<string, string> | null = null
            if (s.uyariMesaji) {
              if (typeof s.uyariMesaji === 'object') {
                warningsObj = s.uyariMesaji as unknown as Record<string, string>
              } else if (typeof s.uyariMesaji === 'string') {
                try { warningsObj = JSON.parse(s.uyariMesaji) } catch { warningsObj = null }
              }
            }

            return {
              id: s.id,
              text: s.soru,
              options: optionsArray,
              type: 'radio',
              bagliSoruId: s.bagliSoruId,
              bagliCevap: s.bagliCevap,
              uyariMesaji: warningsObj
            }
          }))
        } else {
          setDbQuestions([])
        }
      })
      .catch((err) => {
        console.error("Fetch questions error:", err)
        setDbQuestions([])
      })
      .finally(() => setQuestionsLoading(false))
  }, [step, sel.reason, sel.ageGroup, sel.hastaTipi])

  function next() {
    // Özel Mantık: Yaş seçildiğinde Yeni Hasta ise "neden" adımını atla
    if (step === 'yas' && sel.hastaTipi === 'yeni') {
      let r = ''
      if (sel.ageGroup === '0-18 yaş') r = 'Çocuk randevusu (ebeveyn girişi)'
      else r = 'Yeni Hasta Şikayetleri'
      setSel(p => ({ ...p, reason: r }))
      setStep('doktor')
      return
    }
    setStep(activeSteps[stepIdx + 1].id) 
  }
  
  function back() { 
    if (step === 'doktor' && sel.hastaTipi === 'yeni') {
      setStep('yas')
      return
    }
    setStep(activeSteps[stepIdx - 1].id) 
  }

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
          formData, // İçinde tüm cevaplar var
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Hata'); return }
      router.push('/hasta/randevularim')
    } finally { setLoading(false) }
  }

  const selClinic = clinics.find(c => c.id === sel.clinicId)
  const selDoctor = doctors.find(d => d.id === sel.doctorId)

  // Görünür soruları hesapla
  const visibleQuestions = dbQuestions.filter(q => {
    if (!q.bagliSoruId) return true;
    const parentAnswer = formData[q.bagliSoruId]
    if (!parentAnswer) return false;
    if (q.bagliCevap) {
      const allowed = q.bagliCevap.split(',')
      // Parent cevabının baştan eşleşip eşleşmediğine bakıyoruz (Örn: "A) Yeni bir..." vs "A)")
      return allowed.some(a => parentAnswer.startsWith(a.trim()) || parentAnswer === a.trim())
    }
    return true;
  })

  // Tüm görünür sorular cevaplanmış mı?
  const allAnswered = visibleQuestions.length > 0 && visibleQuestions.every(q => formData[q.id])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Randevu Al</h1>
        <p className="page-subtitle">Adımları takip ederek randevunuzu oluşturun.</p>
      </div>
      <div className="page-body">
        <div className="steps">
          {activeSteps.map((s, i) => (
            <div key={s.id} className="step-item">
              <div className={`step-circle${step === s.id ? ' active' : i < stepIdx ? ' done' : ''}`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className={`step-label${step === s.id ? ' active' : ''}`}>{s.label}</span>
              {i < activeSteps.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

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

          {step === 'hasta_tipi' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Randevu Türünüzü Seçin</h2>
              <p className="text-muted" style={{ marginBottom: 20 }}>Daha önce kliniğimize geldiniz mi?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1.5px solid ${sel.hastaTipi === 'yeni' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: sel.hastaTipi === 'yeni' ? 'var(--accent-light)' : 'var(--bg)' }}>
                  <input type="radio" name="htipi" value="yeni" checked={sel.hastaTipi === 'yeni'} onChange={() => setSel(p => ({ ...p, hastaTipi: 'yeni', reason: '' }))} style={{ accentColor: 'var(--accent)' }} />
                  <span className="font-semibold">Yeni Hasta (İlk kez geliyorum)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1.5px solid ${sel.hastaTipi === 'takipli' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: sel.hastaTipi === 'takipli' ? 'var(--accent-light)' : 'var(--bg)' }}>
                  <input type="radio" name="htipi" value="takipli" checked={sel.hastaTipi === 'takipli'} onChange={() => setSel(p => ({ ...p, hastaTipi: 'takipli', reason: '' }))} style={{ accentColor: 'var(--accent)' }} />
                  <span className="font-semibold">Takipli Hasta (Daha önce geldim, kontrol)</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={back}>Geri</button>
                <button className="btn btn-primary" onClick={next} disabled={!sel.hastaTipi}>Devam Et</button>
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
              <p className="text-muted" style={{ marginBottom: 24 }}>Lütfen aşağıdaki soruları dikkatlice yanıtlayın. Seçimlerinize göre yeni sorular çıkabilir.</p>
              
              {questionsLoading ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>⏳ Sorular yükleniyor…</div>
              ) : visibleQuestions.length === 0 ? (
                <p className="text-muted">Bu seçim için ek soru bulunmamaktadır.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {visibleQuestions.map((q, idx) => {
                    const ans = formData[q.id];
                    const warning = (ans && q.uyariMesaji && q.uyariMesaji[ans]) ? q.uyariMesaji[ans] : null;
                    
                    return (
                      <div key={q.id} style={{ padding: '16px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>{idx + 1}. {q.text}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {q.options.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name={q.id} 
                                value={opt} 
                                checked={ans === opt} 
                                onChange={() => setFormData(p => ({ ...p, [q.id]: opt }))} 
                                style={{ accentColor: 'var(--accent)', width: 18, height: 18 }}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        {warning && (
                          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--warning-light)', color: '#92400E', borderRadius: 8, fontSize: '0.85rem', fontWeight: 500, display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                            <span>{warning}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
                <button className="btn btn-secondary" onClick={back}>Geri</button>
                <button className="btn btn-primary" onClick={next} disabled={questionsLoading || !allAnswered}>Devam Et</button>
              </div>
            </div>
          )}

          {step === 'onay' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Randevu Özeti</h2>
              <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
                {[
                  ['Klinik', selClinic?.name],
                  ['Randevu Türü', sel.hastaTipi === 'yeni' ? 'Yeni Hasta' : 'Takipli Hasta'],
                  ['Yaş', sel.ageGroup],
                  ['Doktor', `${selDoctor?.title} ${selDoctor?.fullName}`],
                  ['Tarih', sel.tarih ? new Date(sel.tarih).toLocaleString('tr-TR') : ''],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ width: 100, flexShrink: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)' }}>{k}</span>
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
