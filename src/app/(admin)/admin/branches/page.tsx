"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Plus, 
  Phone, 
  Clock, 
  Trash2, 
  Loader2,
  MoreVertical,
  Scissors,
  Users,
  Calendar,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  _count: {
    barbers: number;
    services: number;
    bookings: number;
  };
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    openTime: "09:00",
    closeTime: "21:00",
    latitude: "",
    longitude: ""
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    phone: "",
    openTime: "09:00",
    closeTime: "21:00",
    latitude: "",
    longitude: ""
  });

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/admin/branches");
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          name: "",
          address: "",
          phone: "",
          openTime: "09:00",
          closeTime: "21:00",
          latitude: "",
          longitude: ""
        });
        fetchBranches();
      } else {
        alert(data.error || "Gagal menambah cabang");
      }
    } catch (err) {
      console.error("Error creating branch:", err);
      alert("Terjadi kesalahan saat menambah cabang");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/branches/${selectedBranch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      
      const data = await res.json();

      if (res.ok) {
        setShowEditModal(false);
        fetchBranches();
      } else {
        alert(data.error || "Gagal memperbarui cabang");
      }
    } catch (err) {
      console.error("Error updating branch:", err);
      alert("Terjadi kesalahan saat memperbarui cabang");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus cabang ini?")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/branches/${id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();

      if (res.ok) {
        fetchBranches();
      } else {
        alert(data.error || "Gagal menghapus cabang");
      }
    } catch (err) {
      console.error("Error deleting branch:", err);
      alert("Terjadi kesalahan saat menghapus cabang");
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setEditFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      latitude: (branch as any).latitude?.toString() || "",
      longitude: (branch as any).longitude?.toString() || ""
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">Branch Management</h2>
          <p className="text-xs text-white/40 mt-1">Manage barbershop locations and operational hours</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-dark transition-all"
        >
          <Plus size={18} />
          Add New Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center">
            <Loader2 className="animate-spin mx-auto text-primary" size={24} />
          </div>
        ) : branches.length === 0 ? (
          <div className="col-span-full py-12 text-center text-white/40">
            No branches found. Add your first branch to get started.
          </div>
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="bg-secondary-light/30 border border-white/5 rounded-3xl p-6 hover:border-primary/20 transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <MapPin size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(branch)}
                    className="p-2 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all"
                    title="Edit Branch"
                  >
                    <MoreVertical size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteBranch(branch.id)}
                    disabled={isDeleting === branch.id}
                    className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-xl transition-all disabled:opacity-50"
                    title="Delete Branch"
                  >
                    {isDeleting === branch.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black mb-1">{branch.name}</h3>
              <p className="text-xs text-white/40 mb-4 line-clamp-1 flex items-center gap-1">
                <MapPin size={12} />
                {branch.address}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Phone size={14} className="text-primary" />
                  {branch.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Clock size={14} className="text-primary" />
                  {branch.openTime} - {branch.closeTime}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6">
                <div className="text-center">
                  <p className="text-lg font-black text-white">{branch._count.barbers}</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Barbers</p>
                </div>
                <div className="text-center border-x border-white/5">
                  <p className="text-lg font-black text-white">{branch._count.services}</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Services</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-white">{branch._count.bookings}</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Bookings</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary-light border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black">Add New Branch</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddBranch} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Branch Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Cibabat (Pusat)"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Address</label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all h-20 resize-none"
                    placeholder="Full address..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="0812..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Open</label>
                    <input 
                      type="time" 
                      value={formData.openTime}
                      onChange={e => setFormData({...formData, openTime: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Close</label>
                    <input 
                      type="time" 
                      value={formData.closeTime}
                      onChange={e => setFormData({...formData, closeTime: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Latitude</label>
                  <input 
                    type="text" 
                    value={formData.latitude}
                    onChange={e => setFormData({...formData, latitude: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="-6.8..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Longitude</label>
                  <input 
                    type="text" 
                    value={formData.longitude}
                    onChange={e => setFormData({...formData, longitude: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="107.5..."
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-black font-black py-4 rounded-xl mt-4 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Branch"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary-light border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black">Edit Branch: {selectedBranch?.name}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditBranch} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Branch Name</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.name}
                    onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Address</label>
                  <textarea 
                    required
                    value={editFormData.address}
                    onChange={e => setEditFormData({...editFormData, address: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={editFormData.phone}
                    onChange={e => setEditFormData({...editFormData, phone: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Open</label>
                    <input 
                      type="time" 
                      value={editFormData.openTime}
                      onChange={e => setEditFormData({...editFormData, openTime: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Close</label>
                    <input 
                      type="time" 
                      value={editFormData.closeTime}
                      onChange={e => setEditFormData({...editFormData, closeTime: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Latitude</label>
                  <input 
                    type="text" 
                    value={editFormData.latitude}
                    onChange={e => setEditFormData({...editFormData, latitude: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Longitude</label>
                  <input 
                    type="text" 
                    value={editFormData.longitude}
                    onChange={e => setEditFormData({...editFormData, longitude: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-black font-black py-4 rounded-xl mt-4 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Update Branch"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
