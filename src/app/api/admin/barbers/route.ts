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

    const role = (session.user as any).role;
    const branchId = (session.user as any).branchId;

    const where: any = {};
    if (role === "admin_cabang" && branchId) {
      where.branchId = branchId;
    }

    const barbers = await prisma.barber.findMany({
      where,
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

    return NextResponse.json(barbers);
  } catch (error) {
    console.error("Fetch Barbers Error:", error);
    return NextResponse.json({ error: "Failed to fetch barbers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const barber = await prisma.barber.create({
      data: {
        name: data.name,
        specialization: data.specialization,
        status: data.status || "active",
        branchId: data.branchId,
        photo: data.photo || null,
        rating: 5.0,
      },
    });

    return NextResponse.json(barber);
  } catch (error) {
    console.error("Create Barber Error:", error);
    return NextResponse.json({ error: "Failed to create barber" }, { status: 500 });
  }
}
