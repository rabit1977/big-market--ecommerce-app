import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
          const { api, convex } = await import('@/lib/convex-server');
          
          // 1. Sync the user with Convex database on every login
          // This ensures that even OAuth users exist in our users table
          await convex.mutation(api.users.syncUser, {
              externalId: user.id!,
              email: user.email || undefined,
              name: user.name || undefined,
              image: user.image || undefined,
              role: (user as any).role || 'USER',
          });
      }

      // Always fetch fresh user data to ensure accountStatus/registrationComplete are up to date
      // This is critical for the registration flow to work without requiring re-login
      if (token.id || (user && user.id)) {
          const userId = (token.id || user?.id) as string;
          const { api, convex } = await import('@/lib/convex-server');
          
          let convexUser = await convex.query(api.users.getByExternalId, { 
              externalId: userId
          });

          // Fallback for credential users where externalId might be "pending"
          if (!convexUser && token.email) {
              convexUser = await convex.query(api.users.getByEmail, { 
                  email: token.email as string 
              });
          }

          if (convexUser) {
              token.id = convexUser.externalId; 
              token.role = convexUser.role || 'USER';
              token.convexId = convexUser._id;
              token.accountType = convexUser.accountType;
              token.companyName = convexUser.companyName;
              token.accountStatus = convexUser.accountStatus;
              token.registrationComplete = !!convexUser.registrationComplete;
          } else if (user) {
              // Fallback for very first render if fetch fails or race condition (should be rare due to sync above)
              token.id = user.id;
              token.role = (user as any).role || 'USER';
              token.accountStatus = 'PENDING_APPROVAL';
              token.registrationComplete = false;
          }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as any) || 'USER';
        // Add custom fields to session user type
        (session.user as any).accountType = token.accountType;
        (session.user as any).companyName = token.companyName;
        (session.user as any).accountStatus = token.accountStatus;
        (session.user as any).registrationComplete = token.registrationComplete;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const user = auth?.user as any;
      const isPricing = nextUrl.pathname.startsWith('/premium') || nextUrl.pathname.startsWith('/checkout');
      const isOnProtected =
        nextUrl.pathname.startsWith('/account') ||
        nextUrl.pathname.startsWith('/my-listings') ||
        nextUrl.pathname.startsWith('/sell');

      const isPending = user?.accountStatus === 'PENDING_APPROVAL';
      const isSuspended = user?.accountStatus === 'SUSPENDED' || user?.accountStatus === 'BANNED';
      const isRegistrationComplete = !!user?.registrationComplete;

      console.log('Authorized check:', { 
        path: nextUrl.pathname, 
        isLoggedIn, 
        isRegistrationComplete,
        accountStatus: user?.accountStatus 
      });

      // Allow access to pricing/checkout for everyone, including pending users
      if (isPricing) return true;

      // 1. Enforce Registration Completion
      if (isLoggedIn && !isRegistrationComplete && !nextUrl.pathname.startsWith('/auth/complete-registration') && !nextUrl.pathname.startsWith('/auth/signout')) {
          return Response.redirect(new URL('/auth/complete-registration', nextUrl));
      }

      // 2. Redirect pending users (but allow complete-registration)
      if (isLoggedIn && isPending && isRegistrationComplete && !nextUrl.pathname.startsWith('/auth/pending') && !nextUrl.pathname.startsWith('/auth/signout')) {
         return Response.redirect(new URL('/auth/pending', nextUrl));
      }
      
      // Redirect suspended users
      if (isLoggedIn && isSuspended && !nextUrl.pathname.startsWith('/auth/suspended') && !nextUrl.pathname.startsWith('/auth/signout')) {
         return Response.redirect(new URL('/auth/suspended', nextUrl));
      }

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;

export default authConfig;
