import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'Dengeli Duyum — Odyoloji ve Vestibüler Klinik',
  description: 'Odyoloji ve Vestibüler rehabilitasyon, çınlama ve işitme kayıpları için modern randevu sistemi.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
