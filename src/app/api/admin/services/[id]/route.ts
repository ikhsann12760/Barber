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

    console.log("UPDATE SERVICE DEBUG:", { id, branchId: data.branchId, name: data.name });

    if (data.branchId === "all") {
      // Logic sinkronisasi semua cabang (Tetap dipertahankan)
      const currentService = await prisma.service.findUnique({
        where: { id },
        select: { branchId: true }
      });

      if (!currentService) {
        return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 });
      }

      const branches = await prisma.branch.findMany({ select: { id: true } });

      const syncResults = await Promise.all(
        branches.map(async (branch) => {
          const existing = await prisma.service.findFirst({
            where: { name: data.name, branchId: branch.id }
          });

          if (existing) {
            return prisma.service.update({
              where: { id: existing.id },
              data: {
                price: parseFloat(data.price),
                durationMinutes: parseInt(data.durationMinutes) || 30,
                description: data.description || "",
              }
            });
          } else if (branch.id === currentService.branchId) {
            return prisma.service.update({
              where: { id },
              data: {
                name: data.name,
                price: parseFloat(data.price),
                durationMinutes: parseInt(data.durationMinutes) || 30,
                description: data.description || "",
              }
            });
          } else {
            return prisma.service.create({
              data: {
                name: data.name,
                price: parseFloat(data.price),
                durationMinutes: parseInt(data.durationMinutes) || 30,
                description: data.description || "",
                branchId: branch.id,
              }
            });
          }
        })
      );

      return NextResponse.json({ 
        message: "Layanan berhasil disinkronkan ke semua cabang",
        updatedCount: syncResults.length 
      });
    }

    // Perbaikan: Pastikan price dikonversi ke float/number agar Prisma bisa memprosesnya dengan benar
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        durationMinutes: parseInt(data.durationMinutes) || 30,
        description: data.description || "",
        branchId: data.branchId, // Ini akan memperbarui ID cabang di database
      },
    });

    console.log("UPDATE SUCCESS:", { id: service.id, newBranchId: service.branchId });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Update Service Error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
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

    // Cek apakah layanan sedang digunakan di booking
    const bookingCount = await prisma.booking.count({
      where: { serviceId: id }
    });

    if (bookingCount > 0) {
      return NextResponse.json({ 
        error: "Tidak bisa menghapus layanan yang masih memiliki riwayat pesanan." 
      }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
