import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Jangan kirim password hash ke client
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "super_admin") {
      console.log("POST /api/admin/users: Unauthorized", session?.user);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log("POST /api/admin/users: Received data:", data);
    const { name, email, password, role, branchId } = data;

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("POST /api/admin/users: Email already exists:", email);
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("BCRYPT HASH ERROR:", hashError);
      return NextResponse.json({ error: "Gagal memproses password" }, { status: 500 });
    }

    // Pastikan branchId valid jika role adalah admin_cabang
    const finalBranchId = (role === "admin_cabang" && branchId && branchId !== "") ? branchId : null;

    // Jika admin_cabang tapi branchId tidak ada
    if (role === "admin_cabang" && !finalBranchId) {
      return NextResponse.json({ error: "Cabang harus dipilih untuk Admin Cabang" }, { status: 400 });
    }

    console.log("POST /api/admin/users: Creating user with branchId:", finalBranchId);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        branchId: finalBranchId,
      },
    });

    console.log("POST /api/admin/users: User created successfully:", newUser.id);

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Create User Error:", error);
    return NextResponse.json({ 
      error: "Failed to create user", 
      details: error.message 
    }, { status: 500 });
  }
}
