import AdminSidebar from "@/components/admin/AdminSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-sm text-white/50 uppercase tracking-widest font-bold">Admin Dashboard</h1>
            <p className="text-2xl font-black">Welcome Back, {user.name || "Admin"}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold">PT Daddy's Cut</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-black">
                {user.role?.replace("_", " ")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold">
              {(user.name?.[0] || user.email?.[0] || "A").toUpperCase()}
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
