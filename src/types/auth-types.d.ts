import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * The shape of the user object as it is stored in the database
   */
  interface User {
    id: string
    role: "ADMIN" | "USER"
    accountType?: string
    companyName?: string
    accountStatus?: string
    registrationComplete?: boolean
    membershipStatus?: "ACTIVE" | "INACTIVE"
    convexId?: string
    email?: string | null
    name?: string | null
    image?: string | null
    bio?: string | null
    createdAt?: Date | number
    updatedAt?: Date | number
  }

  /**
   * The shape of the session object returned by useSession
   */
  interface Session {
    user: User & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "ADMIN" | "USER"
    accountType?: string
    companyName?: string
    accountStatus?: string
    registrationComplete?: boolean
    membershipStatus?: "ACTIVE" | "INACTIVE"
    convexId?: string
    email?: string | null
    name?: string | null
    bio?: string | null
    createdAt?: Date | number
    updatedAt?: Date | number
  }
}
