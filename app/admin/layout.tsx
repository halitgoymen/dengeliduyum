import Sidebar from '@/components/Sidebar'

const NAV = [
  { label: 'Genel Bakış', href: '/admin/dashboard', icon: '📊' },
  { label: 'Doktorlar', href: '/admin/doktorlar', icon: '👨‍⚕️' },
  { label: 'Kullanıcılar', href: '/admin/kullanicilar', icon: '🧑‍🤝‍🧑' },
  { label: 'Klinikler', href: '/admin/klinikler', icon: '🏥' },
  { label: 'Tüm Randevular', href: '/admin/randevular', icon: '📅' },
  { label: 'Anamnez Soruları', href: '/admin/anamnez-sorulari', icon: '📝' },
  { label: 'Sistem Logları', href: '/admin/loglar', icon: '📋' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar navItems={NAV} roleLabel="Admin" />
      <main className="main-content">{children}</main>
    </div>
  )
}
