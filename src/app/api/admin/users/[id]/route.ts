import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    const { name, email, password, role, branchId } = data;

    // Persiapkan data untuk update
    const updateData: any = {
      name,
      email,
      role,
      branchId: (role === "admin_cabang" && branchId) ? branchId : null,
    };

    // Jika password diisi, hash password baru
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Update User Error:", error);
    return NextResponse.json({ 
      error: "Failed to update user",
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Jangan izinkan hapus diri sendiri
    if ((session.user as any).id === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete user",
      details: error.message 
    }, { status: 500 });
  }
}
