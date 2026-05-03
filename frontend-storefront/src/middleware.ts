import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest, NextResponse} from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a protected route (checkout)
  // Pathname will be like /en/checkout or /ar/checkout or /checkout
  const isCheckout = pathname.includes('/checkout');
  
  if (isCheckout) {
    const token = request.cookies.get('access_token')?.value;
    // Note: In a real app, you might want to verify the token here too
    if (!token) {
      // Redirect to login if no token
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
