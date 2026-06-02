import { 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const barbers = [
  { id: "b1", name: "Rizky 'The Blade'", branch: "Cibabat" },
  { id: "b2", name: "Dani 'Fader'", branch: "Cihanjuang" },
  { id: "b3", name: "Aris 'Gentle'", branch: "Sangkurian" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
  "19:00", "19:30", "20:00", "20:30"
];

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black">Schedule Management</h2>
          <p className="text-white/40 text-sm">Manage time slots and availability for all barbers</p>
        </div>
        <button className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all flex items-center gap-2">
          <Plus size={18} />
          Bulk Create Slots
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-secondary-light/30 border border-white/5 p-6 rounded-2xl space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-3 block">Select Branch</label>
              <select className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary">
                <option>Cibabat (Pusat)</option>
                <option>Cihanjuang</option>
                <option>Sangkurian</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-3 block">Select Barber</label>
              <div className="space-y-2">
                {barbers.map((barber) => (
                  <button 
                    key={barber.id}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/20 hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User size={16} className="text-white/40 group-hover:text-primary" />
                      </div>
                      <span className="text-sm font-bold">{barber.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar/Slot View */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-secondary-light/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><ChevronLeft size={20}/></button>
                <div className="flex items-center gap-2">
                  <CalendarIcon size={20} className="text-primary" />
                  <span className="font-bold text-lg">Monday, June 5, 2024</span>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><ChevronRight size={20}/></button>
              </div>
              <button className="text-sm font-bold text-primary hover:underline">Today</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {timeSlots.map((time) => {
                  const isBooked = ["10:30", "11:00", "14:00"].includes(time);
                  const isBreak = ["12:00"].includes(time);
                  
                  return (
                    <button
                      key={time}
                      className={cn(
                        "py-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-1",
                        isBooked ? "bg-red-400/10 border-red-400/20 text-red-400" :
                        isBreak ? "bg-white/5 border-white/10 text-white/20" :
                        "bg-green-400/10 border-green-400/20 text-green-400 hover:border-green-400/50"
                      )}
                    >
                      <span>{time}</span>
                      <span className="text-[8px] uppercase tracking-tighter opacity-60">
                        {isBooked ? "Booked" : isBreak ? "Break" : "Available"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 flex gap-6 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-400/20 border border-green-400/50"></div> <span className="text-green-400/70">Available</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-400/20 border border-red-400/50"></div> <span className="text-red-400/70">Booked</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white/5 border border-white/20"></div> <span className="text-white/20">Break/Off</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
