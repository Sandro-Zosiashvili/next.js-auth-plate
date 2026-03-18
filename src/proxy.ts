// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';
//
// const PUBLIC_PATHS = ['/login', '/register'];
// const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || 'token';
// const JWT_SECRET = process.env.JWT_SECRET;
//
// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get(COOKIE_NAME)?.value;
//
//   const isPublicPath = PUBLIC_PATHS.some(
//       (path) => pathname === path || pathname.startsWith(`${path}/`),
//   );
//
//   // Public path - ყოველთვის გავუშვათ
//   if (isPublicPath) {
//     // თუ ტოკენი აქვს და login-ზეა, გავუშვათ რედირექტი
//     if (token && (pathname === '/login' || pathname === '/register')) {
//       try {
//         // ვამოწმებთ ტოკენი თუ ვალიდურია
//         const secret = new TextEncoder().encode(JWT_SECRET);
//         await jwtVerify(token, secret);
//         // თუ ვალიდურია, გავუშვათ ჰომზე
//         return NextResponse.redirect(new URL('/', request.url));
//       } catch {
//         // თუ არა ვალიდური, წავშალოთ ქუქი და გავუშვათ login გვერდი
//         const response = NextResponse.next();
//         response.cookies.delete(COOKIE_NAME);
//         return response;
//       }
//     }
//     return NextResponse.next();
//   }
//
//   // Protected path - ტოკენის ვალიდაცია სავალდებულოა
//   if (!token) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('from', pathname);
//     return NextResponse.redirect(loginUrl);
//   }
//
//   // ტოკენის ვალიდაცია
//   try {
//     const secret = new TextEncoder().encode(JWT_SECRET);
//     await jwtVerify(token, secret);
//     return NextResponse.next();
//   } catch (error) {
//     // ტოკენი არავალიდურია ან ვადაგასული
//     console.error('Token validation failed:', error);
//
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('from', pathname);
//
//     const response = NextResponse.redirect(loginUrl);
//     response.cookies.delete(COOKIE_NAME);
//
//     return response;
//   }
// }
//
// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
//   ],
// };


// middleware.ts



import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/login', '/register'];
const ADMIN_PATHS = ['/admin'];
const USER_PATHS = ['/user'];

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || 'token';
const JWT_SECRET = process.env.JWT_SECRET!;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


async function getIsAdmin(token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    const { isAdmin } = await res.json();
    return isAdmin === true;
}

export async function proxy(request: NextRequest) {  // ← middleware იყო, proxy გახადე
    // დანარჩენი კოდი იგივეა...

    const { pathname } = request.nextUrl;
    const token = request.cookies.get(COOKIE_NAME)?.value;

    const isPublicPath = PUBLIC_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    // ── Public pages ──────────────────────────────────────────
    if (isPublicPath) {
        // token არ აქვს - გაუშვი
        if (!token) return NextResponse.next();

        try {
            // 1. JWT verify
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token, secret);

            // 2. DB-დან isAdmin
            const isAdmin = await getIsAdmin(token);

            // უკვე logged in - სწორ გვერდზე გაუშვი
            return NextResponse.redirect(
                new URL(isAdmin ? '/admin' : '/user', request.url),
            );
        } catch {
            // invalid token - წავშალოთ და login გავუშვათ
            const response = NextResponse.next();
            response.cookies.delete(COOKIE_NAME);
            return response;
        }
    }

    // ── Protected pages ───────────────────────────────────────
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // 1. JWT verify - ყალბი token აქ იშლება
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);

        // 2. DB-დან isAdmin - token-ს არ ვენდობით
        const isAdmin = await getIsAdmin(token);

        const isAdminPath = ADMIN_PATHS.some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
        );

        const isUserPath = USER_PATHS.some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
        );

        // user → /admin ცდილობს
        if (isAdminPath && !isAdmin) {
            return NextResponse.redirect(new URL('/user', request.url));
        }

        // admin → /user ცდილობს (optional - ადმინს user page არ სჭირდება)
        if (isUserPath && isAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        return NextResponse.next();

    } catch {
        // invalid/expired token
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(COOKIE_NAME);
        return response;
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    ],
};
