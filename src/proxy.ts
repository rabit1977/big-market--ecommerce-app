// Recommended NextAuth v5 pattern, renamed to proxy as per convention
export { auth as proxy } from './auth';

export const config = {
  // Matcher for the proxy
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
