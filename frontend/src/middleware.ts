import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  console.log('Request path:', request.nextUrl.pathname);
  console.log('Token data:', { 
    exists: !!token, 
    role: token?.role,
    isAdmin: token?.isAdmin
  });

  // Check if the request is for protected routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/dashboard')) {
    // Not logged in - redirect to login
    if (!token) {
      console.log('No token - redirecting to signin');
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // For admin routes, check admin role
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (token.role !== 'admin') {
        console.log('Not admin - redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes should be handled by this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*'
  ]
};
