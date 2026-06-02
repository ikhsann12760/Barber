import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId");
    const date = searchParams.get("date");

    if (!barberId || !date) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        barberId,
        date: new Date(date),
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Fetch Schedules Error:", error);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barberId, date, startTime, status } = body;

    const schedule = await prisma.schedule.upsert({
      where: {
        // Karena kita tidak punya id di sini, kita gunakan findUnique jika ada kombinasi unik
        // Tapi di schema, bookingId yang unik. Jadi kita cari dulu.
        id: body.id || "new-id", 
      },
      update: { status },
      create: {
        barberId,
        date: new Date(date),
        startTime,
        status,
      },
    });

    // Jika pencarian berdasarkan kriteria lain (untuk toggle manual)
    const existing = await prisma.schedule.findFirst({
      where: {
        barberId,
        date: new Date(date),
        startTime,
      }
    });

    let result;
    if (existing) {
      result = await prisma.schedule.update({
        where: { id: existing.id },
        data: { status }
      });
    } else {
      result = await prisma.schedule.create({
        data: {
          barberId,
          date: new Date(date),
          startTime,
          status
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update Schedule Error:", error);
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
  }
}
