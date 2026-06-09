import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    const user = session.user as any;

    // Check if user has permission for this booking
    if (user.role === "admin_cabang") {
      const booking = await prisma.booking.findUnique({
        where: { id },
        select: { branchId: true }
      });
      if (!booking || booking.branchId !== user.branchId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: status,
        paymentStatus: paymentStatus,
      },
    });

    // Sinkronisasi status jadwal jika booking dikonfirmasi, dibatalkan, atau dibayar
    if (status === "confirmed" || paymentStatus === "paid") {
      await prisma.schedule.updateMany({
        where: { bookingId: id },
        data: { status: "booked" },
      });
    } else if (status === "cancelled") {
      await prisma.schedule.updateMany({
        where: { bookingId: id },
        data: { status: "available" },
      });
    } else if (status === "completed") {
      // Jika selesai, jadwal bisa tetap 'booked' atau 'available' tergantung kebijakan bisnis
      // Di sini kita biarkan 'booked' sebagai riwayat
    }

    // If payment status is updated to paid, update the related payment record too
    if (paymentStatus === "paid") {
      await prisma.payment.updateMany({
        where: { bookingId: id },
        data: { status: "success" },
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Update Booking Error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = session.user as any;

    // Check if user has permission for this booking
    if (user.role === "admin_cabang") {
      const booking = await prisma.booking.findUnique({
        where: { id },
        select: { branchId: true }
      });
      if (!booking || booking.branchId !== user.branchId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Delete related records first because of constraints
    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { bookingId: id } }),
      prisma.schedule.deleteMany({ where: { bookingId: id } }),
      prisma.booking.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
