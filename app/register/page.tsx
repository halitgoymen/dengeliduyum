'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import logoImg from '../../public/dengeli-logo.png'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Şifreler eşleşmiyor.'); return }
    if (form.password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Kayıt başarısız.'); return }
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logoImg.src} alt="Logo" width="56" height="56" className="auth-logo-icon" style={{ background: 'transparent', boxShadow: 'none' }} />
          <h1 className="auth-title">DengeliDuyum'a Katılın</h1>
          <p className="auth-subtitle">Odyoloji ve Vestibüler Klinik</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Ad Soyad *</label>
            <input id="fullName" type="text" className="form-input" placeholder="Adınız Soyadınız"
              value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">E-posta Adresi *</label>
            <input id="reg-email" type="email" className="form-input" placeholder="ornek@mail.com"
              value={form.email} onChange={e => update('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Telefon Numarası</label>
            <input id="phone" type="tel" className="form-input" placeholder="0500 000 00 00"
              value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Şifre *</label>
              <input id="reg-password" type="password" className="form-input" placeholder="Min. 6 karakter"
                value={form.password} onChange={e => update('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirm">Şifre Tekrar *</label>
              <input id="confirm" type="password" className="form-input" placeholder="••••••"
                value={form.confirm} onChange={e => update('confirm', e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Kaydediliyor…' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="auth-divider">veya</div>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-3)' }}>
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="auth-link">Giriş yapın</Link>
        </p>
      </div>
    </main>
  )
}
