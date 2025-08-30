import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string;
      isAdmin?: boolean;
      role?: string;
    } & DefaultSession["user"];
    token?: string; // Add token to session
  }

  interface User {
    id?: string;
    isAdmin?: boolean;
    role?: string;
    token?: string; // Add token to user
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    isAdmin?: boolean;
    accessToken?: string; // Add token to JWT
  }
}
