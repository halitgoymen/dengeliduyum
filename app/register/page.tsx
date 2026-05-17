'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import logoImg from '../../public/dengeli-logo.png'

const KVKK_TEXT = `GİZLİLİK VE KİŞİSEL VERİLERİ KORUMA POLİTİKASI

dengeliduyum.vercel.app olarak kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermektedir. Kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)'na uygun olarak işlenmekte ve muhafaza edilmektedir.

KİŞİSEL VERİLERİNİZİN NASIL İŞLENDİĞİ

6698 sayılı KVKK uyarınca, dengeliduyum.vercel.app ile paylaştığınız kişisel verileriniz, tamamen veya kısmen, otomatik olarak veyahut herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla elde edilerek, kaydedilerek, depolanarak, değiştirilerek, yeniden düzenlenerek, kısacası veriler üzerinde gerçekleştirilen her türlü işleme konu olarak tarafımızdan işlenebilecektir.

KİŞİSEL VERİLERİNİZİN İŞLENME AMAÇLARI VE HUKUKİ SÜREÇLERİ

Paylaştığınız kişisel veriler;
• Müşterilerimize verdiğimiz hizmetlerin gereklerini, sözleşmenin ve teknolojinin gereklerine uygun şekilde yapabilmek, sunulan ürün ve hizmetlerimizi geliştirebilmek için;
• Kamu güvenliğine ilişkin hususlarda ve hukuki uyuşmazlıklarda, talep halinde ve mevzuat gereği savcılıklara, mahkemelere ve ilgili kamu görevlilerine bilgi verebilmek için;
• Üyelerimize geniş kapsamda çeşitli imkânlar sunabilmek veya bu imkânları sunabilecek kişi veya kurumlarla yasal çerçevede paylaşabilmek için;
• Reklam tercihlerini analiz etmek için 6698 sayılı KVKK ve ilgili ikincil düzenlemelere uygun olarak işlenecektir.

ÜÇÜNCÜ KİŞİLERE VERİ AKTARIMI

Yukarıda belirtilen amaçlarla, dengeliduyum.vercel.app ile paylaştığınız kişisel verilerinizin aktarılabileceği kişi/kuruluşlar; ana hissedarlarımız, reklam verenler, doğrudan veya dolaylı yurt içi/yurt dışı iştiraklerimiz; başta altyapımızı kullanan üye firmalar ve bunlarla sınırlı olmamak üzere sunulan hizmet ile ilgili kişi ve kuruluşlardır.

KİŞİSEL VERİLERİN TOPLANMA ŞEKLİ

Kişisel verileriniz; internet sitesindeki formlar aracılığıyla ad, soyad, adres, telefon, e-posta adresi gibi bilgiler ile; kullanıcı adı ve şifresi kullanılarak giriş yapılan sayfalardaki tercihler, gerçekleştirilen işlemlerin IP kayıtları, tarayıcı tarafından toplanan çerez verileri ile gezinme süre ve detaylarını içeren veriler şeklinde toplanabilmektedir.

KİŞİSEL VERİLERİN SAKLANMASI VE KORUNMASI

dengeliduyum.vercel.app, kişisel verilerinizin barındığı sistemleri ve veri tabanlarını, KVKK'nın 12. Maddesi gereği kişisel verilerin hukuka aykırı olarak işlenmesini önlemek, yetkisiz kişilerin erişimlerini engellemek ve muhafazalarını sağlamak amacıyla gerekli yazılımsal ve fiziksel güvenlik önlemlerini almaktadır.

9. MADDE KAPSAMINDA HAKLARINIZ

6698 sayılı KVKK'nın 11. Maddesi uyarınca kişisel veri sahibi olarak;
• Kişisel veri işlenip işlenmediğini öğrenme,
• Kişisel verilerinizin işlenme amacını öğrenme,
• Kişisel verilerin düzeltilmesini, silinmesini veya yok edilmesini isteme,
• İşlenen verilerin otomatik sistemler vasıtasıyla aleyhine sonuç doğurmasına itiraz etme haklarına sahipsiniz.

Web sayfamızda kişisel verilerinizi paylaşarak bu politikayı okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.`

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [kvkkOkundu, setKvkkOkundu] = useState(false)

  function update(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!kvkkOkundu) { setError('Devam etmek için KVKK metnini okuyup onaylamanız gerekmektedir.'); return }
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
    <main className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 40, paddingBottom: 40 }}>
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <img src={logoImg.src} alt="Logo" width="56" height="56" className="auth-logo-icon" style={{ background: 'transparent', boxShadow: 'none' }} />
          <h1 className="auth-title">DengeliDuyum'a Katılın</h1>
          <p className="auth-subtitle">Odiyoloji ve Vestibüler Klinik</p>
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

          {/* KVKK Metni */}
          <div className="kvkk-section">
            <div className="kvkk-header">
              <span className="kvkk-icon">🔒</span>
              <span className="kvkk-title">Gizlilik ve Kişisel Verilerin Korunması (KVKK)</span>
            </div>
            <div className="kvkk-scroll-box" id="kvkk-text-box">
              {KVKK_TEXT.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: para.startsWith('•') ? 4 : 14, marginTop: 0, whiteSpace: 'pre-line' }}>
                  {para}
                </p>
              ))}
            </div>
            <label className="kvkk-checkbox-label" htmlFor="kvkk-onay">
              <input
                id="kvkk-onay"
                type="checkbox"
                checked={kvkkOkundu}
                onChange={e => setKvkkOkundu(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--accent)', flexShrink: 0 }}
              />
              <span>
                Yukarıdaki <strong>KVKK metnini okudum</strong> ve kişisel verilerimin belirtilen amaçlarla işlenmesini <strong>kabul ediyorum</strong>.
              </span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !kvkkOkundu}
            style={{ marginTop: 20, opacity: (!kvkkOkundu || loading) ? 0.5 : 1 }}>
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
