import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ['/dashboard', '/projects'];
/**
 * 
 * @param {import ("next/server").NextRequest} request
 */
export default async function middleware(request: import("next/server").NextRequest) {

    let supabaseResponse = NextResponse.next({
        request
    })

    const supabase =createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll (cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options}) => {
                        request.cookies.set(name, value);
                    })
                    supabaseResponse = NextResponse.next({
                        request
                    })
                    cookiesToSet.forEach(({ name, value, options}) => {
                        supabaseResponse.cookies.set(name, value, options);
                    })
                    
                }
            }
        }
    )

    const pathname = request.nextUrl.pathname

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname === route || pathname.startsWith(route + '/')
    );


    const session = await supabase.auth.getUser()

    if (isProtectedRoute && (!session.data.user || session.error)) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return supabaseResponse

}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}