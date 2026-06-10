"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Loader2,
  X,
  Scissors,
  MapPin,
  Clock,
  RefreshCcw,
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string | null;
  branchId: string;
  branch: Branch;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationMinutes: "30",
    description: "",
    branchId: ""
  });

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
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
        if (data.length > 0 && !formData.branchId) {
          setFormData(prev => ({ ...prev, branchId: data[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchBranches();
  }, []);

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      price: "",
      durationMinutes: "30",
      description: "",
      branchId: branches[0]?.id || ""
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      durationMinutes: service.durationMinutes.toString(),
      description: service.description || "",
      branchId: service.branchId
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const url = editingService 
      ? `/api/admin/services/${editingService.id}` 
      : "/api/admin/services";
    const method = editingService ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        fetchServices();
      } else {
        alert(data.error || "Failed to save service");
      }
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Terjadi kesalahan saat menyimpan layanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchServices();
      } else {
        alert(data.error || "Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Terjadi kesalahan saat menghapus layanan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">Service Management</h2>
          <p className="text-xs text-white/40 mt-1">Manage haircut packages and additional services</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-dark transition-all"
        >
          <Plus size={18} />
          Add New Service
        </button>
      </div>

      <div className="bg-secondary-light/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={24} />
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No services found
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-primary">
                          <Scissors size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{service.name}</span>
                          <span className="text-xs text-white/40 truncate max-w-[200px]">{service.description || "No description"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin size={14} className="text-white/20" />
                        {service.branch?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">
                      Rp {Number(service.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {service.durationMinutes} min
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(service)}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteService(service.id)}
                          className="p-2 hover:bg-red-400/10 text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
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

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary-light border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black">{editingService ? "Edit Service" : "Add New Service"}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Service Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="e.g. Premium Haircut"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Price (Rp)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Duration (min)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.durationMinutes}
                    onChange={e => setFormData({...formData, durationMinutes: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Branch</label>
                <select 
                  required
                  value={formData.branchId}
                  onChange={e => setFormData({...formData, branchId: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white"
                >
                  <option value="" disabled>Select Branch</option>
                  <option value="all" className="text-primary font-bold">Semua Cabang (All Branches)</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all h-24 resize-none"
                  placeholder="What's included in this service?"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-black font-black py-4 rounded-xl mt-4 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingService ? "Update Service" : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
