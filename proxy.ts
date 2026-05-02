import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the session; getUser() validates it against the Supabase server.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAppArea = pathname.startsWith('/app')
  // Public routes inside /app that do not require a session.
  const isAuthPage =
    pathname.startsWith('/app/entrar') || pathname.startsWith('/app/registrar')

  if (isAppArea && !isAuthPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/app/entrar'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Apply the proxy to every route except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
