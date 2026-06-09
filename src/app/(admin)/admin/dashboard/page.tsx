"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // <-- TAMBAHKAN INI
import { 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  Wallet,
  Loader2,
  Building2 // <-- TAMBAHKAN INI
} from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const iconMap: Record<string, any> = {
  Wallet,
  CalendarCheck,
  Users,
  TrendingUp
};

export default function AdminDashboardPage() {
  // 1. Ambil status loading bawaan dari next-auth
  const { data: session, status } = useSession(); 
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const statsData = await res.json();
        setData(statsData);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 2. Jika sesi NextAuth masih dicek ATAU data stats masih loading, tampilkan loading spinner
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // Ambil nama cabang dengan aman tanpa memicu crash jika properti null
  const branchName = session?.user && "branch" in session.user && (session.user as any).branch?.name 
    ? (session.user as any).branch.name 
    : "Semua Cabang (Pusat)";
  return (
    <div className="space-y-8">
     {/* Masukkan mulai baris 53 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary-light/30 border border-white/5 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-black">Selamat Datang, {session?.user?.name || "Admin"}!</h2>
          <p className="text-sm text-white/50">Berikut ringkasan statistik barbershop Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-xl">
          <Building2 className="text-primary" size={20} />
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Lokasi Cabang</p>
            <p className="text-sm font-bold text-white">
              {(session?.user as any)?.branch?.name || "Semua Cabang (Pusat)"}
            </p>
          </div>
        </div>
      </div> 
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats.map((stat: any) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.name} className="bg-secondary-light/50 border border-white/5 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-black/40 ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <p className="text-white/50 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-secondary-light/50 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h4 className="font-bold">Recent Bookings</h4>
              <Link href="/admin/bookings" className="text-primary text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-white/5">
              {data?.recentBookings.length === 0 ? (
                <div className="p-12 text-center text-white/40">No recent bookings</div>
              ) : (
                data?.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                        {booking.customerName[0]}
                      </div>
                      <div>
                        <p className="font-bold">{booking.customerName}</p>
                        <p className="text-xs text-white/40">
                          {booking.service?.name} • {booking.appointmentTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        booking.status === "confirmed" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl">
            <h4 className="font-bold text-primary mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/#booking" className="bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-dark transition-all text-center">
                Add New Booking
              </Link>
              <Link href="/admin/schedules" className="bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all text-center">
                Update Schedule
              </Link>
              <button className="bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all">
                Generate Report
              </button>
            </div>
          </div>

          <div className="bg-secondary-light/50 border border-white/5 p-6 rounded-2xl">
            <h4 className="font-bold mb-4">Barber Status</h4>
            <div className="space-y-4">
              {['Rizky', 'Dani', 'Aris'].map((barber) => (
                <div key={barber} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-sm font-medium">{barber}</span>
                  </div>
                  <span className="text-xs text-white/40 italic">Online</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
