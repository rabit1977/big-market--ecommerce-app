import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';
import authConfig from './auth.config';
 
// Wrapped proxy option as per Next.js 16 + NextAuth v5 conventions
const { auth } = NextAuth(authConfig);

// Next.js recognizes this file as middleware when named middleware.ts and using default export
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic can go here
  // The authorized callback in auth.config.ts will handle the logic
});

export const config = {
  // Matcher for the proxy
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
