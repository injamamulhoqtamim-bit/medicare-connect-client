"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  FileText,
  UserCircle,
  LogOut,
  Stethoscope,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function DoctorSidebar() {
  const pathname = usePathname();

  const { data: session } = authClient.useSession();

  const [doctorProfile, setDoctorProfile] = useState(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // GET DOCTOR PROFILE FROM BACKEND
  // ==========================================
  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/doctor/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to load doctor profile");
          return;
        }

        const data = await res.json();

        if (data.success) {
          setDoctorProfile(data.profile || null);
        }
      } catch (error) {
        console.error("Doctor sidebar profile error:", error);
      }
    };

    if (session?.user) {
      loadDoctorProfile();
    }
  }, [session, API_URL]);

  // ==========================================
  // DOCTOR DATA
  // ==========================================

  const doctorName =
    doctorProfile?.name ||
    session?.user?.name ||
    "Doctor";

  const doctorImage =
    doctorProfile?.image ||
    session?.user?.image ||
    "";

  // ==========================================
  // IMAGE URL
  // ==========================================

  const imageUrl = doctorImage
    ? doctorImage.startsWith("http")
      ? doctorImage
      : `${API_URL}${
          doctorImage.startsWith("/") ? "" : "/"
        }${doctorImage}`
    : "";

  // ==========================================
  // MENU
  // ==========================================

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
      label: "Prescriptions",
      href: "/dashboard/doctor/prescriptions",
      icon: FileText,
    },
    {
      label: "Profile Credentials",
      href: "/dashboard/profile",
      icon: UserCircle,
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard/doctor") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 flex flex-col shadow-sm">

      {/* Doctor Panel Header */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Doctor Panel
            </h2>

            <p className="text-xs text-slate-500">
              MediCare Connect
            </p>
          </div>

        </div>
      </div>

      {/* ==========================================
          DOCTOR INFORMATION
      ========================================== */}
      <div className="px-5 py-6 border-b border-slate-200">

        <div className="flex flex-col items-center text-center">

          {/* Doctor Image */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-100 bg-slate-100 flex items-center justify-center mb-3">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={doctorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <UserCircle className="w-12 h-12 text-slate-400" />
            )}

          </div>

          {/* Doctor Name */}
          <h3 className="font-bold text-lg text-slate-900">
            {doctorName}
          </h3>

          {/* Role */}
          <p className="text-sm text-teal-600 font-medium mt-1">
            Doctor
          </p>

        </div>

      </div>

      {/* ==========================================
          NAVIGATION
      ========================================== */}
      <nav className="flex-1 px-4 py-5 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                active
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />

              <span>{item.label}</span>
            </Link>
          );
        })}

      </nav>

      {/* ==========================================
          LOGOUT
      ========================================== */}
      <div className="px-4 py-5 border-t border-slate-200">

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 font-medium hover:bg-rose-50 transition"
        >
          <LogOut className="w-5 h-5" />

          <span>Exit Dashboard</span>
        </button>

      </div>

    </aside>
  );
}