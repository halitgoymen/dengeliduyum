import Sidebar from '@/components/Sidebar'

const NAV = [
  { label: 'Genel Bakış', href: '/admin/dashboard', icon: '📊' },
  { label: 'Doktorlar', href: '/admin/doktorlar', icon: '👨‍⚕️' },
  { label: 'Hastalar', href: '/admin/hastalar', icon: '🧑‍🤝‍🧑' },
  { label: 'Klinikler', href: '/admin/klinikler', icon: '🏥' },
  { label: 'Tüm Randevular', href: '/admin/randevular', icon: '📅' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar navItems={NAV} roleLabel="Admin" />
      <main className="main-content">{children}</main>
    </div>
  )
}
