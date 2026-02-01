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

          // 2. Fetch the actual user from Convex to get the correct role and Convex ID
          // This is useful if the role was changed in the Convex dashboard
          const convexUser = await convex.query(api.users.getByExternalId, { 
              externalId: user.id! 
          });

          if (convexUser) {
              token.id = convexUser.externalId; // Keep using externalId as the primary reference
              token.role = convexUser.role || 'USER';
              token.convexId = convexUser._id; // Store original Convex ID just in case
              token.accountType = convexUser.accountType;
              token.companyName = convexUser.companyName;
          } else {
              token.id = user.id;
              token.role = (user as any).role || 'USER';
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
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected =
        nextUrl.pathname.startsWith('/account') ||
        nextUrl.pathname.startsWith('/my-listings') ||
        nextUrl.pathname.startsWith('/sell');

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
