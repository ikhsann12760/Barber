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

    const where: any = {};
    if (role === "admin_cabang" && branchId) {
      where.branchId = branchId;
    }

    // Jalankan query secara paralel untuk meningkatkan performa
    const [totalBookings, activeBarbers, successfulPayments, recentBookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.barber.count({ 
        where: { 
          status: "active",
          ...(role === "admin_cabang" && branchId ? { branchId } : {})
        } 
      }),
      prisma.payment.findMany({
        where: { 
          status: "success",
          booking: where
        },
        select: { amount: true },
      }),
      prisma.booking.findMany({
        where,
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          service: true,
        },
      })
    ]);
    
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + Number(p.amount), 0);

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
