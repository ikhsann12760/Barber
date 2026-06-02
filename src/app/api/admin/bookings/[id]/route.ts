import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: status,
        paymentStatus: paymentStatus,
      },
    });

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
