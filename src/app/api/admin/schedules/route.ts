import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId");
    const date = searchParams.get("date");

    if (!barberId || !date) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const schedules = await prisma.schedule.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { barberId, date, startTime, status } = body;

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Cari jadwal yang sudah ada untuk barber, tanggal, dan jam tersebut
    const existing = await prisma.schedule.findFirst({
      where: {
        barberId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
