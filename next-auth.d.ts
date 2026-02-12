import { DefaultSession } from 'next-auth';



declare module 'next-auth' {
  /**
   * Extends the built-in session.user type
   */
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
      bio?: string | null;
      createdAt: Date; // 🔥 Add createdAt here
      accountStatus?: string;
      registrationComplete?: boolean;
      accountType?: string;
      companyName?: string;
    } & DefaultSession['user'];
  }

  /**
   * Extends the built-in user type (returned from authorize callback)
   */
  interface User {
    id: string;
    role: "ADMIN" | "USER";
    bio?: string | null;
    createdAt: Date; // 🔥 Add createdAt here
    accountStatus?: string;
    registrationComplete?: boolean;
    accountType?: string;
    companyName?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT token type
   */
  interface JWT {
    id: string;
    role: "ADMIN" | "USER";
    bio?: string | null;
    createdAt: Date; // 🔥 Add createdAt here
    accountStatus?: string;
    registrationComplete?: boolean;
    accountType?: string;
    companyName?: string;
  }
}