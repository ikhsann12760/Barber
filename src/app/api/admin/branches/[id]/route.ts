import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
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

    const branch = await prisma.branch.update({
      where: { id },
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
  } catch (error: any) {
    console.error("Update Branch Error:", error);
    return NextResponse.json({ 
      error: "Failed to update branch",
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

    // Cek apakah ada data terkait (barber, service, booking)
    const branchWithCounts = await prisma.branch.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            barbers: true,
            services: true,
            bookings: true
          }
        }
      }
    });

    if (!branchWithCounts) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    if (
      branchWithCounts._count.barbers > 0 || 
      branchWithCounts._count.services > 0 || 
      branchWithCounts._count.bookings > 0
    ) {
      return NextResponse.json({ 
        error: "Tidak bisa menghapus cabang yang masih memiliki barber, layanan, atau pesanan aktif." 
      }, { status: 400 });
    }

    await prisma.branch.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Branch deleted successfully" });
  } catch (error: any) {
    console.error("Delete Branch Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete branch",
      details: error.message 
    }, { status: 500 });
  }
}
