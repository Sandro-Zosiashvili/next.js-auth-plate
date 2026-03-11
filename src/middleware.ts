import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/login', '/register'];
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || 'token';
const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isPublicPath = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  // Public path - ყოველთვის გავუშვათ
  if (isPublicPath) {
    // თუ ტოკენი აქვს და login-ზეა, გავუშვათ რედირექტი
    if (token && (pathname === '/login' || pathname === '/register')) {
      try {
        // ვამოწმებთ ტოკენი თუ ვალიდურია
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        // თუ ვალიდურია, გავუშვათ ჰომზე
        return NextResponse.redirect(new URL('/', request.url));
      } catch {
        // თუ არა ვალიდური, წავშალოთ ქუქი და გავუშვათ login გვერდი
        const response = NextResponse.next();
        response.cookies.delete(COOKIE_NAME);
        return response;
      }
    }
    return NextResponse.next();
  }

  // Protected path - ტოკენის ვალიდაცია სავალდებულოა
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ტოკენის ვალიდაცია
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    // ტოკენი არავალიდურია ან ვადაგასული
    console.error('Token validation failed:', error);

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