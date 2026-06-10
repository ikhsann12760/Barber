"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Clock, 
  Users, 
  Settings, 
  Scissors,
  LogOut,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const menuItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Branches", href: "/admin/branches", icon: MapPin, roles: ["super_admin"] },
  { name: "Barbers", href: "/admin/barbers", icon: Scissors, roles: ["super_admin"] },
  { name: "Services", href: "/admin/services", icon: Scissors, roles: ["super_admin"] },
  { name: "Schedules", href: "/admin/schedules", icon: Clock },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["super_admin"] },
  { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["super_admin"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <div className="w-64 bg-secondary-light border-r border-white/5 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <img src="/img/logo.png" className="w-8 h-8 rounded-full" alt="Logo" />
          <span className="text-white">DADDY'S</span>
          <span className="text-primary">CUT</span>
        </Link>
        {userRole === "super_admin" && (
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-2 inline-block font-black uppercase tracking-widest">
            Super Admin
          </span>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive 
                  ? "bg-primary text-black" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
