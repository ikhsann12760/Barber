"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
  "19:00", "19:30", "20:00", "20:30"
];

export default function SchedulesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [barbers, setBarbers] = useState<any[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch Branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/admin/branches");
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
          if (data.length > 0) {
            setSelectedBranchId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };
    
    fetchBranches();
  }, []);

  // Fetch Barbers when Branch changes
  useEffect(() => {
    const fetchBarbers = async () => {
      if (!selectedBranchId) return;
      try {
        const res = await fetch(`/api/admin/barbers?branchId=${selectedBranchId}`);
        if (res.ok) {
          const data = await res.json();
          setBarbers(data);
          if (data.length > 0) {
            setSelectedBarberId(data[0].id);
          } else {
            setSelectedBarberId("");
          }
        }
      } catch (err) {
        console.error("Error fetching barbers:", err);
      }
    };

    fetchBarbers();
  }, [selectedBranchId]);

  // Fetch Schedules
  const fetchSchedules = async () => {
    if (!selectedBarberId || !selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/schedules?barberId=${selectedBarberId}&date=${selectedDate}`);
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedBarberId, selectedDate]);

  const toggleStatus = async (time: string, currentStatus: string | undefined) => {
    setUpdatingId(time);
    const newStatus = currentStatus === "booked" ? "available" : "booked";
    
    try {
      await fetch("/api/admin/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: selectedBarberId,
          date: selectedDate,
          startTime: time,
          status: newStatus
        })
      });
      fetchSchedules();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Schedule Management</h2>
          <p className="text-white/40 text-sm">Kelola ketersediaan jam kerja barber</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-secondary-light/30 border border-white/5 p-6 rounded-2xl space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-3 block">Pilih Cabang</label>
              <select 
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-3 block">Pilih Barber</label>
              <div className="space-y-2">
                {barbers.map((barber) => (
                  <button 
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group",
                      selectedBarberId === barber.id ? "border-primary bg-primary/10" : "border-white/5 bg-black/20 hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User size={16} className={cn(selectedBarberId === barber.id ? "text-primary" : "text-white/40")} />
                      </div>
                      <span className="text-sm font-bold text-white">{barber.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-secondary-light/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"><ChevronLeft size={20}/></button>
                <div className="flex items-center gap-2">
                  <CalendarIcon size={20} className="text-primary" />
                  <span className="font-bold text-lg text-white">
                    {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"><ChevronRight size={20}/></button>
              </div>
              <button 
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="text-sm font-bold text-primary hover:underline"
              >
                Hari Ini
              </button>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {timeSlots.map((time) => {
                    const schedule = Array.isArray(schedules) ? schedules.find(s => s.startTime === time) : null;
                    const isBooked = schedule?.status === "booked";
                    const isUpdating = updatingId === time;
                    
                    return (
                      <button
                        key={time}
                        onClick={() => toggleStatus(time, schedule?.status)}
                        disabled={isUpdating}
                        className={cn(
                          "py-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 relative",
                          isBooked ? "bg-red-400/10 border-red-400/20 text-red-400" : "bg-green-400/10 border-green-400/20 text-green-400 hover:border-green-400/50"
                        )}
                      >
                        {isUpdating && <Loader2 className="animate-spin absolute inset-0 m-auto text-white" size={16} />}
                        <span className={cn(isUpdating && "opacity-0")}>{time}</span>
                        <span className={cn("text-[8px] uppercase tracking-tighter opacity-60", isUpdating && "opacity-0")}>
                          {isBooked ? "Booked" : "Available"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 flex gap-6 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-400/20 border border-green-400/50"></div> <span className="text-green-400/70">Available (Bisa di-booking)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-400/20 border border-red-400/50"></div> <span className="text-red-400/70">Booked (Sudah Terisi)</span></div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-start gap-4">
            <AlertCircle className="text-primary shrink-0" size={20} />
            <div>
              <p className="text-sm text-white/80 leading-relaxed">
                <span className="font-bold text-primary">Info:</span> Klik pada kotak jam untuk mengubah status jadwal secara manual. 
                Jadwal yang berubah menjadi <span className="text-red-400 font-bold">Booked</span> tidak akan muncul di menu booking customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
