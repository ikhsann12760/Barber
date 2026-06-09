import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Generate hash password menggunakan library yang terinstall di project
    const securePassword = await bcrypt.hash("Admin123!", 10);

    // Update atau buat baru jika user admin belum ada
    const updatedUser = await prisma.user.upsert({
      where: { email: "admin@daddyscut.com" },
      update: {
        password: securePassword,
        role: "super_admin"
      },
      create: {
        name: "admin",
        email: "admin@daddyscut.com",
        password: securePassword,
        role: "super_admin"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Password admin berhasil diperbarui menggunakan bcryptjs!",
      user: { email: updatedUser.email, role: updatedUser.role }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}