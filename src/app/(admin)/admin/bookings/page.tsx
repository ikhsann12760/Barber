"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCcw,
  Wallet
} from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: { name: string; price: number };
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  paymentStatus: string;
  branch?: { name: string };
  payment?: { amount: number };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, status: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus: paymentStatus || "unpaid" }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000); // Auto refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black">Booking Management</h2>
          <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
            <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchBookings}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all font-bold text-sm border border-white/5"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all">
            Add New Booking
          </button>
        </div>
      </div>

      {/* Filters (UI Only for now) */}
      <div className="bg-secondary-light/30 border border-white/5 p-4 rounded-2xl flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search customer name..."
            className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <select className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary">
          <option>All Status</option>
          <option>confirmed</option>
          <option>pending</option>
          <option>completed</option>
          <option>cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-secondary-light/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{booking.customerName}</span>
                        <span className="text-xs text-white/40">{booking.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">{booking.service?.name}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{booking.branch?.name || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold flex items-center gap-1">
                          <CalendarIcon size={14} className="text-white/40" />
                          {new Date(booking.appointmentDate).toLocaleDateString('id-ID')}
                        </span>
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Clock size={14} className="text-white/40" />
                          {booking.appointmentTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md flex items-center gap-1 w-fit",
                        booking.status === "confirmed" && "bg-green-400/10 text-green-400",
                        booking.status === "pending" && "bg-yellow-400/10 text-yellow-400",
                        booking.status === "completed" && "bg-blue-400/10 text-blue-400",
                        booking.status === "cancelled" && "bg-red-400/10 text-red-400",
                      )}>
                        {booking.status === "confirmed" && <CheckCircle2 size={12} />}
                        {booking.status === "pending" && <AlertCircle size={12} />}
                        {booking.status === "cancelled" && <XCircle size={12} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-xs font-bold uppercase",
                          booking.paymentStatus === "paid" ? "text-green-400" : "text-white/40"
                        )}>
                          {booking.paymentStatus}
                        </span>
                        <span className="text-xs text-primary font-bold">
                          Rp {(booking.payment?.amount || booking.service?.price || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {booking.status === "pending" && (
                          <button 
                            onClick={() => updateBooking(booking.id, "confirmed", booking.paymentStatus)}
                            className="p-2 hover:bg-green-400/10 text-green-400 rounded-lg transition-all title='Confirm Booking'"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {booking.paymentStatus !== "paid" && (
                          <button 
                            onClick={() => updateBooking(booking.id, booking.status, "paid")}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all title='Mark as Paid'"
                          >
                            <Wallet size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 hover:bg-red-400/10 text-red-400 rounded-lg transition-all title='Delete Booking'"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
