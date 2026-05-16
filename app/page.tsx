import Link from 'next/link'
import { auth } from '@/auth'
import heroImg from '../public/hero-img2.png'
import clinicTeamImg from '../public/clinic-team2.png'

export default async function Home() {
  const session = await auth()

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-header">
        <div className="container landing-nav">
          <div className="landing-logo">
            <span className="landing-logo-text">Dengeli Duyum</span>
          </div>
          <nav className="landing-menu">
            <a href="#hizmetler" className="active">Hizmetlerimiz</a>
            <a href="#hakkimizda">Hakkımızda</a>
            <a href="#yorumlar">Yorumlar</a>
          </nav>
          <div className="landing-links">
            {session ? (
              <Link href={`/${session.user.role}/dashboard`} className="btn btn-dark">Panele Git</Link>
            ) : (
              <Link href="/login" className="btn btn-dark">Randevu Al</Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-main">
        <section className="hero-section">
          <div className="container hero-container">
            <div className="hero-content">
              <h1 className="hero-title">Daha İyi Duyun,<br />Hayata Bağlanın</h1>
              <p className="hero-subtitle">
                Uzman kadromuz ve son teknoloji ekipmanlarımızla işitme sağlığınız için yanınızdayız. Klinik mükemmelliği sıcak bir bakımla birleştiriyoruz.
              </p>
              <div className="hero-buttons">
                {session ? (
                  <Link href={`/${session.user.role}/dashboard`} className="btn btn-dark btn-lg">Randevularınızı Yönetin</Link>
                ) : (
                  <Link href="/register" className="btn btn-dark btn-lg">Hemen Randevu Al</Link>
                )}
                <a href="#hizmetler" className="btn btn-outline btn-lg">Hizmetlerimizi İnceleyin</a>
              </div>
            </div>
            <div className="hero-visual">
              <img src={heroImg.src} alt="Doctor and Patient" className="hero-img" />
              <div className="hero-badge">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                %100 Uzman Onaylı Bakım
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="hizmetler" className="services-section">
          <div className="container">
            <div className="section-pre">PROFESYONEL ÇÖZÜMLER</div>
            <h2 className="section-title">Klinik Hizmetlerimiz</h2>
            <div className="services-grid">
              {[
                { icon: '🦻', title: 'İşitme Testleri', desc: 'En son teknoloji odyometri cihazları ile hassas ve kapsamlı ölçümler gerçekleştiriyoruz.' },
                { icon: '🎛️', title: 'Cihaz Uygulaması', desc: 'Yaşam tarzınıza ve işitme kaybınıza en uygun modern cihaz seçimini birlikte yapıyoruz.' },
                { icon: '👶', title: 'Çocuk Odyolojisi', desc: 'Çocuklara özel yaklaşım ve oyun odyometrisi ile miniklerin dünyasını seslerle dolduruyoruz.' },
                { icon: '🔔', title: 'Tinnitus Tedavisi', desc: 'Kulak çınlaması problemlerinde kişiye özel terapi yöntemleri ve maskeleme çözümleri sunuyoruz.' },
              ].map((f, i) => (
                <div key={i} className="service-card">
                  <div className="service-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <Link href="/register" className="service-link">Detaylar &rarr;</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="hakkimizda" className="why-section">
          <div className="container why-container">
            <div className="why-images">
              <img src={clinicTeamImg.src} alt="Clinic Team" className="why-img why-img-1" />
              <img src={heroImg.src} alt="Clinic Room" className="why-img why-img-2" style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '60%', border: '8px solid var(--bg)' }} />
            </div>
            <div className="why-content">
              <h2>Neden Bizi Seçmelisiniz?</h2>
              <p>Dengeli Duyum olarak, işitme sağlığınızı sadece bir hizmet olarak değil, yaşam kalitenizin anahtarı olarak görüyoruz.</p>
              <div className="why-list">
                {[
                  { title: 'Uzman Doktor Kadrosu', desc: 'Alanında uzman odyologlarımızla en doğru tanıyı koyuyoruz.' },
                  { title: 'Modern Teknoloji', desc: 'Dünyanın en gelişmiş işitme cihazı ve tanı ekipmanlarını kullanıyoruz.' },
                  { title: 'Kişiye Özel Bakım', desc: 'Her hastamızın ihtiyacına özel rehabilitasyon programları hazırlıyoruz.' },
                ].map((item, i) => (
                  <div key={i} className="why-item">
                    <div className="why-item-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="yorumlar" className="testimonials-section">
          <div className="container">
            <h2 className="section-title">Mutlu Hastalarımız Ne Diyor?</h2>
            <div className="testi-grid">
              {[
                { name: 'Ahmet Y., Emekli Öğretmen', text: '"Dengeli Duyum sayesinde torunumun sesini yıllar sonra ilk kez net bir şekilde duyabildim. Profesyonel yaklaşımları için teşekkür ederim."' },
                { name: 'Selin K., Mimar', text: '"Çocuğumun işitme problemi için başvurduk. Güler yüzlü kadrosu ve çocuklara özel ilgileri bizi çok etkiledi. Kesinlikle tavsiye ederim."' },
                { name: 'Murat R., Yazılımcı', text: '"Çınlama problemim için gitmediğim yer kalmamıştı. Buradaki terapi yöntemleri sayesinde hayatım normale döndü. Çok minnettarım."' },
              ].map((t, i) => (
                <div key={i} className="testi-card">
                  <div className="stars">★★★★★</div>
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-author">&mdash; {t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container footer-content">
          <div className="footer-brand">
            Dengeli Duyum
          </div>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/halit-g%C3%B6ymen-565331211/" target="_blank" rel="noopener noreferrer">Geliştirici: Halit Göymen (LinkedIn)</a>
            <a href="#">İletişim Bilgileri</a>
            <a href="#">Şube ve Konumlar</a>
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Koşulları</a>
          </div>
          <div className="footer-text">
            © {new Date().getFullYear()} Dengeli Duyum Odyoloji Kliniği. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  )
}
