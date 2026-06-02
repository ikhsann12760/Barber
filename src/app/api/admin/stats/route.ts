import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalBookings = await prisma.booking.count();
    const activeBarbers = await prisma.barber.count({ where: { status: "active" } });
    
    const successfulPayments = await prisma.payment.findMany({
      where: { status: "success" },
      select: { amount: true },
    });
    
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        service: true,
      },
    });

    const stats = [
      { 
        name: "Total Revenue", 
        value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, 
        change: "+0%", 
        icon: "Wallet", 
        color: "text-green-400" 
      },
      { 
        name: "Total Bookings", 
        value: totalBookings.toString(), 
        change: "+0%", 
        icon: "CalendarCheck", 
        color: "text-blue-400" 
      },
      { 
        name: "Active Barbers", 
        value: activeBarbers.toString(), 
        change: "0%", 
        icon: "Users", 
        color: "text-primary" 
      },
      { 
        name: "Growth Rate", 
        value: "0%", 
        change: "+0%", 
        icon: "TrendingUp", 
        color: "text-purple-400" 
      },
    ];

    return NextResponse.json({
      stats,
      recentBookings,
    });
  } catch (error) {
    console.error("Fetch Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
