"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Scissors, 
  Star, 
  MapPin, 
  Trash2, 
  Loader2,
  X,
  UserCheck,
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
}

interface Barber {
  id: string;
  name: string;
  specialization: string;
  photo: string | null;
  rating: number;
  status: string;
  branchId: string;
  branch: Branch;
}

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    specialization: "Haircut & Shaving",
    branchId: "",
    status: "active"
  });

  const fetchBarbers = async () => {
    try {
      const res = await fetch("/api/admin/barbers");
      if (res.ok) {
        const data = await res.json();
        setBarbers(data);
      }
    } catch (err) {
      console.error("Error fetching barbers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/admin/branches");
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, branchId: data[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  useEffect(() => {
    fetchBarbers();
    fetchBranches();
  }, []);

  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          name: "",
          specialization: "Haircut & Shaving",
          branchId: branches[0]?.id || "",
          status: "active"
        });
        fetchBarbers();
      } else {
        alert(data.error || "Gagal menambah barber");
      }
    } catch (err) {
      console.error("Error creating barber:", err);
      alert("Terjadi kesalahan saat menambah barber");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">Barber Management</h2>
          <p className="text-xs text-white/40 mt-1">Manage professional barbers and their assigned branches</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-dark transition-all"
        >
          <Plus size={18} />
          Add New Barber
        </button>
      </div>

      <div className="bg-secondary-light/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Barber</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Rating</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={24} />
                  </td>
                </tr>
              ) : barbers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No barbers found.
                  </td>
                </tr>
              ) : (
                barbers.map((barber) => (
                  <tr key={barber.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                          {barber.name[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-sm">{barber.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <Scissors size={14} className="text-primary/40" />
                        {barber.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary/40" />
                        {barber.branch.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md flex items-center gap-1 w-fit",
                        barber.status === "active" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                      )}>
                        {barber.status === "active" ? <UserCheck size={12} /> : <UserX size={12} />}
                        {barber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-primary font-bold">
                        <Star size={14} fill="currentColor" />
                        {barber.rating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-red-400/10 text-red-400 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Barber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary-light border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black">Add New Barber</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddBarber} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Barber Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="e.g. Ahmad Kapster"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Specialization</label>
                <input 
                  type="text" 
                  required
                  value={formData.specialization}
                  onChange={e => setFormData({...formData, specialization: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="e.g. Haircut & Styling"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Branch</label>
                <select 
                  required
                  value={formData.branchId}
                  onChange={e => setFormData({...formData, branchId: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white"
                >
                  <option value="" disabled={branches.length > 0}>
                    {branches.length > 0 ? "Select Branch" : "No branches found"}
                  </option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
                {branches.length === 0 && (
                  <p className="text-[10px] text-red-400 mt-1">
                    Belum ada cabang. Silakan tambah cabang di menu Branches terlebih dahulu.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-black font-black py-4 rounded-xl mt-4 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Register Barber"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
