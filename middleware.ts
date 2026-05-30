import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
let res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        detectSessionInUrl: false,
      },
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set({ name: key, value, ...options });
        },
        remove: (key) => {
          res.cookies.set({ name: key, value: '', maxAge: 0 });
        },
      },
    }
  )

  const pathname = req.nextUrl.pathname

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|static|favicon\.ico|icons|navbar_icons|module_icons|image-no-background-500x500\.png|site\.webmanifest|manifest\.json|robots\.txt|browserconfig\.xml|apple-touch-icon\.png|mstile-150x150\.png|login|register|reset-password).*)',
  ],
}