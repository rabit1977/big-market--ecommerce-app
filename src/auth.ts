import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { z } from "zod"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // GitHub OAuth Provider
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // Credentials Provider (email/password)
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const { api, convex } = await import('@/lib/convex-server');
            
            const user = await convex.query(api.users.getByEmail, { email });
            if (!user || !user.password) return null;
            
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
                return {
                    id: user.externalId === "pending" ? user._id : user.externalId,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role as any,
                    createdAt: new Date(user._creationTime),
                    updatedAt: new Date(user._creationTime)
                };
            }
          }
          
          return null;
        } catch (error) {
          console.error("Error during authorize function:", error);
          return null;
        }
      },
    }),
  ],
  // OAuth user creation/lookup is now handled in the JWT callback (auth.config.ts)
})

