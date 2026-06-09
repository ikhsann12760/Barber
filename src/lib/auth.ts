import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Hapus adapter Prisma karena kita menggunakan strategy: "jwt" 
  // dan schema Prisma tidak memiliki tabel Session/Account yang lengkap untuk adapter standar.
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email/Username dan password wajib diisi");
          }

          const cleanEmail = credentials.email.trim();
          console.log("DEBUG AUTH: Mencoba login untuk:", `"${cleanEmail}"`);

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: { equals: cleanEmail, mode: 'insensitive' } },
                { name: { equals: cleanEmail, mode: 'insensitive' } },
                // Tambahkan pencarian manual jika mode insensitive bermasalah di environment tertentu
                { email: cleanEmail },
                { name: cleanEmail }
              ]
            }
          });

          if (!user) {
            console.log("DEBUG AUTH: User tidak ditemukan di database");
            throw new Error("Email atau password salah");
          }

          console.log("DEBUG AUTH: User ditemukan:", user.email);

          if (!user.password) {
            console.log("DEBUG AUTH: User tidak memiliki password di database");
            throw new Error("Email atau password salah");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("DEBUG AUTH: Password valid?", isPasswordValid);

          if (!isPasswordValid) {
            console.log("DEBUG AUTH: Password tidak cocok");
            throw new Error("Email atau password salah");
          }

          console.log("DEBUG AUTH: Login berhasil untuk:", user.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            branchId: user.branchId,
          };
        } catch (error: any) {
          console.error("DEBUG AUTH ERROR:", error.message);
          throw new Error(error.message || "Terjadi kesalahan saat login");
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.branchId = (user as any).branchId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).branchId = token.branchId;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect ke login jika terjadi error auth
  },
  //debug: process.env.NODE_ENV === "development",
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};
