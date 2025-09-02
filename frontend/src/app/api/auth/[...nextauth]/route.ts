import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { API_CONFIG } from "@/lib/config";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/signin`, {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          }),
          headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json();

        if (res.ok && data.success) {
          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: data.user.role,
            isAdmin: data.user.role === 'admin',
            token: data.token,
            _debug: { originalData: data.user }
          };
        }

        // Always throw the error message from the backend
        throw new Error(data.message || "Authentication failed");
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.role = user.role;
        token.accessToken = user.token; // Pass the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.role = token.role as string;
        (session.user as any).accessToken = token.accessToken; // Include JWT token in user object
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
