"use server";

import { prisma } from "@/lib/prisma";
import { coreApi, snap } from "@/lib/midtrans";

export async function createMidtransSnapToken(data: {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingId: string;
}) {
  try {
    const parameter = {
      transaction_details: {
        order_id: data.bookingId,
        gross_amount: data.amount,
      },
      customer_details: {
        first_name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      },
      usage_limit: 1,
    };

    const response = await snap.createTransaction(parameter);
    return { token: response.token };
  } catch (error) {
    console.error("Midtrans Snap Error:", error);
    throw new Error("Gagal membuat token pembayaran");
  }
}

export async function saveBookingToDb(data: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  branchId: string;
  barberId: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentStatus: string;
  status: string;
  amount: number;
}) {
  try {
    // Cari data pendukung untuk memastikan ID valid
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    const branch = await prisma.branch.findUnique({ where: { id: data.branchId } });
    const barber = data.barberId === "default" 
      ? await prisma.barber.findFirst({ where: { branchId: data.branchId } })
      : await prisma.barber.findUnique({ where: { id: data.barberId } });

    if (!service || !branch || !barber) {
      throw new Error("Layanan, cabang, atau barber tidak ditemukan");
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        status: data.status,
        paymentStatus: data.paymentStatus,
        service: { connect: { id: service.id } },
        branch: { connect: { id: branch.id } },
        barber: { connect: { id: barber.id } },
        schedule: {
          create: {
            barber: { connect: { id: barber.id } },
            date: new Date(data.appointmentDate),
            startTime: data.appointmentTime,
            status: "booked"
          }
        },
        payment: {
          create: {
            amount: data.amount,
            status: "pending",
            paymentGateway: "Midtrans"
          }
        }
      },
      include: {
        payment: true
      }
    });
    return booking;
  } catch (error) {
    console.error("Save Booking Error:", error);
    throw error;
  }
}

export async function getBranches() {
  return await prisma.branch.findMany({
    include: {
      services: true,
      barbers: true,
    },
  });
}

export async function getBarbersByBranch(branchId: string) {
  return await prisma.barber.findMany({
    where: { branchId, status: "active" },
  });
}

export async function getServicesByBranch(branchId: string) {
  return await prisma.service.findMany({
    where: { branchId },
  });
}

export async function getSchedulesByBarberAndDate(barberId: string, date: Date) {
  return await prisma.schedule.findMany({
    where: {
      barberId,
      date: {
        equals: date,
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
}
