"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Star,
  CreditCard,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PatientSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState({
    name: "Patient Name",
    email: "",
    image: "",
  });

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/patient/profile`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setProfile({
            name: data.user.name || "Patient Name",
            email: data.user.email || "",
            image: data.user.image || "",
          });
        }
      } catch (err) {
        console.error("Failed to load patient profile:", err);
      }
    };

    fetchPatientProfile();
  }, []);

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard/patient",
      icon: LayoutDashboard,
    },
    {
      name: "My Appointments",
      href: "/dashboard/patient/my-appointments",
      icon: CalendarDays,
    },
    {
      name: "My Reviews",
      href: "/dashboard/patient/my-reviews",
      icon: Star,
    },
    {
      name: "Payment History",
      href: "/dashboard/patient/payment-history",
      icon: CreditCard,
    },
    {
      name: "Doctor Chat",
      href: "/dashboard/patient/messages",
      icon: MessageSquare,
    },
    {
      name: "Prescriptions",
      href: "/dashboard/patient/prescriptions",
      icon: FileText,
    },
    {
      name: "Edit Profile",
      href: "/dashboard/patient/profile",
      icon: User,
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4 shadow-sm">
      {/* Patient Profile Box */}
      <div className="flex flex-col items-center border-b border-slate-100 pb-6 pt-2">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-teal-100 ring-4 ring-teal-50">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-teal-600" />
          )}
        </div>
        <h2 className="mt-3 font-bold text-slate-800">{profile.name}</h2>
        <p className="text-xs text-slate-500">{profile.email || "Patient Account"}</p>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex flex-1 flex-col space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-600 text-white shadow-md shadow-teal-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-teal-600"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}