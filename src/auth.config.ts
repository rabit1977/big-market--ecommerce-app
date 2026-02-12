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
              token.membershipStatus = convexUser.membershipStatus || 'INACTIVE';
          } else if (user) {
              // Fallback for very first render if fetch fails or race condition (should be rare due to sync above)
              token.id = user.id;
              token.role = (user as any).role || 'USER';
              token.accountStatus = 'PENDING_APPROVAL';
              token.registrationComplete = false;
              token.membershipStatus = 'INACTIVE';
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
        (session.user as any).membershipStatus = token.membershipStatus;
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
        nextUrl.pathname.startsWith('/sell') ||
        nextUrl.pathname.startsWith('/admin');

      const isPending = user?.accountStatus === 'PENDING_APPROVAL';
      const isSuspended = user?.accountStatus === 'SUSPENDED' || user?.accountStatus === 'BANNED';
      const isRegistrationComplete = !!user?.registrationComplete;
      const isSubscribed = user?.membershipStatus === 'ACTIVE';

      // 1. Redirect suspended users immediately
      if (isLoggedIn && isSuspended && !nextUrl.pathname.startsWith('/auth/suspended') && !nextUrl.pathname.startsWith('/auth/signout')) {
         return Response.redirect(new URL('/auth/suspended', nextUrl));
      }

      // 2. Allow access to signout for everyone
      if (nextUrl.pathname.startsWith('/auth/signout')) return true;

      // 3. Enforce Registration Completion first
      if (isLoggedIn && !isRegistrationComplete) {
          if (!nextUrl.pathname.startsWith('/auth/complete-registration')) {
              return Response.redirect(new URL('/auth/complete-registration', nextUrl));
          }
          return true;
      }

      // 4. After registration, enforce Payment (Subscription)
      // Only enforce if they are NOT an admin (admins might not need subs)
      if (isLoggedIn && isRegistrationComplete && !isSubscribed && user?.role !== 'ADMIN') {
          // Allow access to pricing and success pages
          if (isPricing || nextUrl.pathname.startsWith('/premium/success')) return true;
          
          // Redirect everything else to premium for payment
          return Response.redirect(new URL('/premium', nextUrl));
      }

      // 5. After Payment, if still Pending Approval, redirect to Pending page
      if (isLoggedIn && isSubscribed && isPending) {
         if (!nextUrl.pathname.startsWith('/auth/pending')) {
            return Response.redirect(new URL('/auth/pending', nextUrl));
         }
         return true;
      }

      // 6. Handle general protected routes
      if (isOnProtected) {
        if (isLoggedIn) {
            // If they are logged in but got here, they must be approved or admin
            if (isPending && user?.role !== 'ADMIN') {
                return Response.redirect(new URL('/auth/pending', nextUrl));
            }
            return true;
        }
        return false;
      }

      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;

export default authConfig;
