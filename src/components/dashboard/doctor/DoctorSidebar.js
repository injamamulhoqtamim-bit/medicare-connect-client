"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  FileText,
  UserCircle,
  LogOut,
} from "lucide-react";

export default function DoctorSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard Overview",
      href: "/dashboard/doctor",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Schedules",
      href: "/dashboard/doctor/schedule",
      icon: CalendarDays,
    },
    {
      label: "Appointments",
      href: "/dashboard/doctor/appointments",
      icon: ClipboardList,
    },
    {
      label: "Prescription Cabin",
      href: "/dashboard/doctor/prescriptions",
      icon: FileText,
    },
    {
      label: "Profile Credentials",
      href: "/dashboard/profile",
      icon: UserCircle,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between">
      
      <div>
        {/* Sidebar Title */}
        <div className="px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Doctor Panel
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            Doctor Dashboard
          </h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/doctor" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-teal-600 text-white font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Exit Dashboard */}
      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-5 h-5" />

          <span>Exit Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}