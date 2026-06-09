import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Mengambil data dinamis yang dikirim oleh client/frontend
    const body = await request.json();
    const { email, password, name, role, branchId } = body;

    // Validasi input minimal
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi!" },
        { status: 400 }
      );
    }

    // Ambil format hash aman menggunakan bcryptjs bawaan project
    const securePassword = await bcrypt.hash(password, 10);

    // Upsert secara dinamis berdasarkan email yang dikirim
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        name: name || undefined,
        password: securePassword,
        role: role || undefined,
        branchId: branchId || null
      },
      create: {
        name: name || email.split('@')[0],
        email: email,
        password: securePassword,
        role: role || "admin_cabang", // Default role jika tidak diisi
        branchId: branchId || null
      }
    });

    return NextResponse.json({
      success: true,
      message: `Data user ${user.email} berhasil diproses!`,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}