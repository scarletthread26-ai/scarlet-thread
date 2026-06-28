import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, bypass middleware so the app still runs
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 1. Admin route protection
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('roles(name)')
          .eq('id', user.id)
          .single()

        if ((profile?.roles as any)?.name === 'admin') {
          const url = request.nextUrl.clone()
          url.pathname = '/admin/dashboard'
          const redirectResponse = NextResponse.redirect(url)
          supabaseResponse.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c))
          return redirectResponse
        }
      }
      return supabaseResponse
    }

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      const redirectResponse = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c))
      return redirectResponse
    }

    // Verify admin role in DB
    const { data: profile } = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single()

    if ((profile?.roles as any)?.name !== 'admin') {
      // User is logged in but not an admin, sign out and redirect to admin login
      await supabase.auth.signOut()
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      const redirectResponse = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c))
      return redirectResponse
    }
  }

  // 2. Customer Dashboard route protection
  if (pathname.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      const redirectResponse = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c))
      return redirectResponse
    }

    // Prevent admins from accessing customer account pages
    const { data: profile } = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single()

    if ((profile?.roles as any)?.name === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      const redirectResponse = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c))
      return redirectResponse
    }
  }

  // 3. Customer Auth routes redirect if already logged in
  if (
    user &&
    (pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password')
  ) {
    const { data: profile } = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    if ((profile?.roles as any)?.name === 'admin') {
      url.pathname = '/admin/dashboard'
    } else {
      url.pathname = '/account'
    }

    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c))
    return redirectResponse
  }


  return supabaseResponse
}
