import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-sm text-white/50 uppercase tracking-widest font-bold">Admin Dashboard</h1>
            <p className="text-2xl font-black">Welcome Back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold">PT Daddy's Cut</p>
              <p className="text-xs text-white/40">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold">
              AD
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
