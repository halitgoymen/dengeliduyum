'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

interface NavItem { label: string; href: string; icon: string }

interface SidebarProps { navItems: NavItem[]; roleLabel: string }

export default function Sidebar({ navItems, roleLabel }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <img src="/dengeli-logo.png" alt="Logo" width="36" height="36" className="logo-img" />
          <div>
            <div className="logo-text">DengeliDuyum</div>
            <div className="logo-sub">{roleLabel} Paneli</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${pathname === item.href ? ' active' : ''}`}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.name || 'Kullanıcı'}
            </div>
            <div className="user-role">{roleLabel}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="btn btn-secondary btn-sm btn-full"
          style={{ marginTop: 8 }}
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
