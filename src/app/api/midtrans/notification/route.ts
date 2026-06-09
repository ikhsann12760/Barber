import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coreApi } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const notification = await req.json();

    // Verifikasi notifikasi dengan Midtrans
    const statusResponse = await coreApi.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

    let paymentStatus = "pending";
    let bookingStatus = "pending";

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        paymentStatus = "pending";
      } else if (fraudStatus === "accept") {
        paymentStatus = "paid";
        bookingStatus = "confirmed";
      }
    } else if (transactionStatus === "settlement") {
      paymentStatus = "paid";
      bookingStatus = "confirmed";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      paymentStatus = "failed";
      bookingStatus = "cancelled";
    } else if (transactionStatus === "pending") {
      paymentStatus = "pending";
    }

    // Update database
    await prisma.$transaction([
      prisma.payment.update({
        where: { bookingId: orderId },
        data: {
          status: paymentStatus === "paid" ? "success" : paymentStatus === "failed" ? "failed" : "pending",
          transactionId: statusResponse.transaction_id,
          updatedAt: new Date(),
        },
      }),
      prisma.booking.update({
        where: { id: orderId },
        data: {
          paymentStatus: paymentStatus,
          status: bookingStatus,
          updatedAt: new Date(),
          // Update schedule status through relation
          schedule: {
            update: {
              status: bookingStatus === "confirmed" ? "booked" : bookingStatus === "cancelled" ? "available" : "pending",
              updatedAt: new Date(),
            }
          }
        },
      }),
    ]);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Midtrans Notification Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
