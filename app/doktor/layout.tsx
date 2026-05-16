import Sidebar from '@/components/Sidebar'

const NAV = [
  { label: 'Randevularım', href: '/doktor/dashboard', icon: '📋' },
]

export default function DoktorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar navItems={NAV} roleLabel="Doktor" />
      <main className="main-content">{children}</main>
    </div>
  )
}
