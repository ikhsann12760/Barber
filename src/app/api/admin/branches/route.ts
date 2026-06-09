import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("GET /api/admin/branches: Unauthorized - No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("GET /api/admin/branches: Fetching branches for user:", (session.user as any).email);

    const branches = await prisma.branch.findMany({
      include: {
        _count: {
          select: {
            barbers: true,
            services: true,
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`GET /api/admin/branches: Found ${branches.length} branches`);
    return NextResponse.json(branches);
  } catch (error: any) {
    console.error("Fetch Branches Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch branches",
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const branch = await prisma.branch.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        openTime: data.openTime || "09:00",
        closeTime: data.closeTime || "21:00",
      },
    });

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Create Branch Error:", error);
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  }
}
