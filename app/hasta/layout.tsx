import Sidebar from '@/components/Sidebar'

const NAV = [
  { label: 'Randevu Al', href: '/hasta/dashboard', icon: '📅' },
  { label: 'Randevularım', href: '/hasta/randevularim', icon: '📋' },
]

export default function HastaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar navItems={NAV} roleLabel="Hasta" />
      <main className="main-content">{children}</main>
    </div>
  )
}
