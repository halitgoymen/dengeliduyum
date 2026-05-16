import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const publicPaths = ['/login', '/register']
  if (publicPaths.includes(pathname) || pathname.startsWith('/api/auth') || pathname.startsWith('/api/seed')) {
    return NextResponse.next()
  }

  if (!session && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const role = session?.user?.role

  if (pathname === '/') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/hasta') && role !== 'hasta') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url))
  }
  if (pathname.startsWith('/doktor') && role !== 'doktor') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url))
  }
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
