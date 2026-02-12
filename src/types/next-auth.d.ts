import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      accountType?: string
      companyName?: string
      accountStatus?: string
      registrationComplete?: boolean
      role: "ADMIN" | "USER"
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accountType?: string
    companyName?: string
    accountStatus?: string
    registrationComplete?: boolean
    role: "ADMIN" | "USER"
  }
}
