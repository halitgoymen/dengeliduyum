'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'hasta' | 'doktor' | 'admin'>('hasta')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roleLabel = { hasta: 'Hasta', doktor: 'Doktor', admin: 'Admin' }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email, password, loginType: tab, redirect: false,
      })
      if (res?.error) {
        setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
      } else {
        router.push(`/${tab}/dashboard`)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/dengeli-logo.png" alt="Logo" width="56" height="56" className="auth-logo-icon" style={{ background: 'transparent', boxShadow: 'none' }} />
          <h1 className="auth-title">DengeliDuyum</h1>
          <p className="auth-subtitle">Odyoloji ve Vestibüler Klinik</p>
        </div>

        <div className="auth-tabs">
          {(['hasta', 'doktor', 'admin'] as const).map((r) => (
            <button key={r} className={`auth-tab${tab === r ? ' active' : ''}`} onClick={() => { setTab(r); setError('') }}>
              {roleLabel[r]}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-posta Adresi</label>
            <input id="email" type="email" className="form-input" placeholder="ornek@mail.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Şifre</label>
            <input id="password" type="password" className="form-input" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Giriş yapılıyor…' : `${roleLabel[tab]} olarak giriş yap`}
          </button>
        </form>

        {tab === 'hasta' && (
          <>
            <div className="auth-divider">veya</div>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-3)' }}>
              Hesabınız yok mu?{' '}
              <Link href="/register" className="auth-link">Kayıt olun</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
