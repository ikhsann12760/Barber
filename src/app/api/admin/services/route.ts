import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      include: {
        branch: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Fetch Services Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    if (data.branchId === "all") {
      // Ambil semua cabang
      const branches = await prisma.branch.findMany({
        select: { id: true }
      });

      if (branches.length === 0) {
        return NextResponse.json({ error: "Belum ada cabang yang terdaftar." }, { status: 400 });
      }

      // Buat layanan untuk setiap cabang
      const services = await Promise.all(
        branches.map((branch) =>
          prisma.service.create({
            data: {
              name: data.name,
              price: data.price,
              durationMinutes: parseInt(data.durationMinutes) || 30,
              description: data.description || "",
              branchId: branch.id,
            },
          })
        )
      );

      return NextResponse.json({ 
        message: `Berhasil menambahkan layanan ke ${services.length} cabang.`,
        count: services.length 
      });
    }

    const service = await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        durationMinutes: parseInt(data.durationMinutes) || 30,
        description: data.description || "",
        branchId: data.branchId,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Create Service Error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
