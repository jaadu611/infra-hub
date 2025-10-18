// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("[Auth] Incoming authorize request");
        console.log("Host:", req.headers.get("host"));
        console.log("Credentials:", credentials);

        await connectDB();
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing email or password");
          return null;
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          console.log("[Auth] User not found:", credentials.email);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          console.log("[Auth] Invalid password for user:", credentials.email);
          return null;
        }

        console.log("[Auth] User authorized:", user.email);
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login", // redirect errors here
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
  debug: true, // <-- enables NextAuth debug logs
});

// ✅ export handlers for App Router
export const { handlers, signIn, signOut, auth } = handler;
