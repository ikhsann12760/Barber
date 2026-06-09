"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Save, 
  Shield, 
  Smartphone,
  CreditCard,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({
    name: "Super Admin",
    email: "admin@daddyscut.com",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [systemConfig, setSystemConfig] = useState({
    whatsappNumber: "628123456789",
    midtransEnabled: true,
    autoConfirmBooking: false,
    maintenanceMode: false,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
    }, 1000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Password baru tidak cocok!" });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: "success", text: "Password berhasil diubah!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: "success", text: "Pengaturan sistem berhasil disimpan!" });
    }, 1000);
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const tabs = [
    { id: "profile", name: "Profil", icon: User },
    { id: "security", name: "Keamanan", icon: Lock },
    { id: "system", name: "Sistem", icon: Shield },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black mb-2">Settings</h2>
        <p className="text-white/40">Kelola profil admin dan konfigurasi sistem</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-bold ${
          message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? "bg-primary text-black font-bold" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon size={20} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-secondary-light/30 border border-white/5 rounded-[2rem] p-8 md:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-8 relative">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                    <User size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Informasi Profil</h3>
                    <p className="text-white/40 text-sm mt-1">Kelola bagaimana identitas Anda muncul di sistem</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                    <input 
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-300 placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Alamat Email</label>
                    <input 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-300 placeholder:text-white/10"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="group flex items-center justify-center gap-3 bg-primary text-black font-black px-8 py-4 rounded-2xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/10"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} className="group-hover:scale-110 transition-transform" /> Simpan Perubahan</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleUpdatePassword} className="space-y-8 relative">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-400 shadow-inner border border-red-500/20">
                    <Lock size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Keamanan Akun</h3>
                    <p className="text-white/40 text-sm mt-1">Perbarui password Anda secara berkala untuk keamanan</p>
                  </div>
                </div>

                <div className="max-w-md space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Password Saat Ini</label>
                    <input 
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-red-500/30 focus:ring-4 focus:ring-red-500/5 transition-all duration-300"
                    />
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Password Baru</label>
                    <input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Konfirmasi Password Baru</label>
                    <input 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="group flex items-center justify-center gap-3 bg-primary text-black font-black px-8 py-4 rounded-2xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/10"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} className="group-hover:scale-110 transition-transform" /> Update Password</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "system" && (
              <form onSubmit={handleUpdateConfig} className="space-y-8 relative">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner border border-blue-500/20">
                    <Shield size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Konfigurasi Sistem</h3>
                    <p className="text-white/40 text-sm mt-1">Atur integrasi pihak ketiga dan parameter operasional</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Smartphone size={12} /> WhatsApp Business Number
                      </label>
                      <input 
                        type="text"
                        value={systemConfig.whatsappNumber}
                        onChange={(e) => setSystemConfig({...systemConfig, whatsappNumber: e.target.value})}
                        className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-300"
                        placeholder="628..."
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-primary/20 transition-colors group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Midtrans Gateway</p>
                          <p className="text-white/30 text-[10px] mt-0.5">Aktifkan pembayaran Snap online</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input 
                          type="checkbox" 
                          checked={systemConfig.midtransEnabled}
                          onChange={(e) => setSystemConfig({...systemConfig, midtransEnabled: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-12 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/20 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-black"></div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-primary/20 transition-colors group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                          <Bell size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Auto Confirm</p>
                          <p className="text-white/30 text-[10px] mt-0.5">Konfirmasi pesanan otomatis</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input 
                          type="checkbox" 
                          checked={systemConfig.autoConfirmBooking}
                          onChange={(e) => setSystemConfig({...systemConfig, autoConfirmBooking: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-12 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/20 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-black"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-red-500/5 rounded-3xl border border-red-500/10 hover:border-red-500/30 transition-colors group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-colors">
                          <Globe size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-red-400/80">Maintenance Mode</p>
                          <p className="text-red-400/20 text-[10px] mt-0.5">Nonaktifkan fitur booking customer</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input 
                          type="checkbox" 
                          checked={systemConfig.maintenanceMode}
                          onChange={(e) => setSystemConfig({...systemConfig, maintenanceMode: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-12 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/20 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500/40 peer-checked:after:bg-white"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="group flex items-center justify-center gap-3 bg-primary text-black font-black px-8 py-4 rounded-2xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/10"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} className="group-hover:scale-110 transition-transform" /> Simpan Konfigurasi</>}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
