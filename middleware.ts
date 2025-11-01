import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/checklist') ||
    request.nextUrl.pathname.startsWith('/profile');

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checklist/:path*', '/profile/:path*'],
};
