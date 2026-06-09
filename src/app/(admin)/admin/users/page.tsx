"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  MapPin, 
  Trash2, 
  Loader2,
  RefreshCcw,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  branchId: string | null;
  branch: Branch | null;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin_cabang",
    branchId: ""
  });

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Kosongkan password saat edit
      role: user.role,
      branchId: user.branchId || ""
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin_cabang",
      branchId: branches[0]?.id || ""
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/admin/branches"); // Perlu pastikan API ini ada atau buat baru
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
    fetchUsers();
    fetchBranches();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi tambahan di frontend
    if (formData.role === "admin_cabang" && !formData.branchId) {
      alert("Silakan pilih cabang untuk Admin Cabang");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      const method = editingUser ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (res.ok) {
        handleCloseModal();
        fetchUsers();
      } else {
        alert(data.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }
    } catch (err) {
      console.error(`Error ${editingUser ? 'updating' : 'creating'} user:`, err);
      alert(`Terjadi kesalahan saat ${editingUser ? 'memperbarui' : 'membuat'} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Terjadi kesalahan saat menghapus user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">User Management</h2>
          <p className="text-xs text-white/40 mt-1">Manage system administrators and branch staff</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-dark transition-all"
        >
          <Plus size={18} />
          Add New User
        </button>
      </div>

      <div className="bg-secondary-light/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Joined Date</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-primary">
                          {user.name?.[0] || user.email?.[0] || "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{user.name || "No Name"}</span>
                          <span className="text-xs text-white/40">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md",
                        user.role === "super_admin" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                      )}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin size={14} className="text-white/20" />
                        {user.branch?.name || "All Branches"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
                          title="Edit User"
                        >
                          <RefreshCcw size={18} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 hover:bg-red-400/10 text-red-400 rounded-lg transition-all"
                          title="Delete User"
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

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary-light border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black">{editingUser ? "Edit User Account" : "Add New User"}</h3>
              <button onClick={handleCloseModal} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                </label>
                <input 
                  type="password" 
                  required={!editingUser}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  placeholder={editingUser ? "••••••••" : "Min. 6 characters"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Role</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="admin_cabang">Admin Cabang</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                
                {formData.role === "admin_cabang" && (
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
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-black font-black py-4 rounded-xl mt-4 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingUser ? "Update User Account" : "Create User Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
