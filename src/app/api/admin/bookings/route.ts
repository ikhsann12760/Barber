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

    console.log(`Fetching bookings for role: ${role}, branchId: ${branchId}`);

    const where: any = {};
    if (role === "admin_cabang" && branchId) {
      where.branchId = branchId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      take: 100, // Tambahkan limit agar load tidak berat
      include: {
        service: true,
        branch: true,
        barber: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
