import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    // Find the real host and protocol from Nginx headers, or fallback to the request URL
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'
    const protocol = (request.headers.get('x-forwarded-proto') || 'http').split(',')[0]
    const publicOrigin = `${protocol}://${host}`

    if (code) {
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Force the redirect to the public domain with the /resumy subpath
            return NextResponse.redirect(`${publicOrigin}/resumy/resume-creator/`)
        }
    }

    // fallback: return the user to the creator page
    return NextResponse.redirect(`${publicOrigin}/resumy/resume-creator/`)
}
