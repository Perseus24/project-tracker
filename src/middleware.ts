// import { NextRequest, NextResponse } from "next/server"
// import { getCurrentUser } from "./lib/supabase"

// export async function middleware(request: NextRequest){
//     console.log("jello")
//     const user = await getCurrentUser();
//     console.log("user", user);
//     if(!user){
//         return NextResponse.redirect(
//             new URL('/', request.url)
//         );
//     } 

//     return NextResponse.redirect(
//         new URL('/projects', request.url)
//     );
// }

// export const config = {
//     matcher: ['/dashboard', '/dashboard/:path*', '/projects', '/projects/:path*'],
// }

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard", "/projects"]);
export default clerkMiddleware( async (auth, req) => {
    if(isProtectedRoute(req)) await auth.protect();
});

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/projects",
        "/projects/:path*",
    ],
};