"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCog, 
  ShieldCheck, 
  Stethoscope, 
  CreditCard 
} from "lucide-react";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Users",
    href: "/dashboard/admin/manage-users",
    icon: UserCog,
  },
  {
    name: "Manage Doctors",
    href: "/dashboard/admin/manage-doctors",
    icon: Stethoscope,
  },
  {
    name: "Verify Doctors",
    href: "/dashboard/admin/verify-doctors",
    icon: ShieldCheck,
  },
  {
    name: "Payment History",
    href: "/dashboard/admin/payments",
    icon: CreditCard,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-65px)] p-4 flex flex-col shrink-0">
      <div className="mb-6 px-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Admin Portal
        </h2>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}