// Recommended NextAuth v5 middleware pattern
export { auth as default } from './auth';

export const config = {
  // Matcher for the proxy
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
