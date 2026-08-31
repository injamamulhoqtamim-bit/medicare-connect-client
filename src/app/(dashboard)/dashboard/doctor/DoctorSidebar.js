"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  FileText,
  User,
  LogOut,
  Camera,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DoctorSidebar() {
  const pathname = usePathname();
  const { data: sessionData, isPending } = authClient.useSession();
  const fileInputRef = useRef(null);

  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadDoctorData() {
      try {
        // ১. Session চেক করা
        const sessionUser = sessionData?.user || sessionData?.data?.user;

        if (sessionUser?.name) {
          setDoctorInfo({
            name: sessionUser.name,
            email: sessionUser.email || "",
            image: sessionUser.image || sessionUser.avatar || "",
          });
          setLoading(false);
          return;
        }

        // ২. LocalStorage চেক করা (রেজিস্ট্রেশনের সাথে সাথে এটি কাজ করবে)
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.name) {
            setDoctorInfo({
              name: parsedUser.name,
              email: parsedUser.email || "",
              image: parsedUser.image || parsedUser.avatar || "",
            });
            setLoading(false);
          }
        }

        // ৩. ব্যাকএন্ড প্রোফাইল API থেকে ডাটা ফেচ করা
        const res = await fetch(`${API_URL}/api/doctor/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          // ব্যাকএন্ডের বিভিন্ন ফিল্ড নেম চেক
          const profile = data.user || data.doctor || data.profile || data;

          if (profile) {
            setDoctorInfo((prev) => ({
              name: profile.name || profile.fullName || prev.name || "Doctor",
              email: profile.email || prev.email || "",
              image: profile.image || profile.avatar || profile.profileImg || prev.image || "",
            }));
          }
        }
      } catch (err) {
        console.error("Sidebar profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending) {
      loadDoctorData();
    }
  }, [sessionData, isPending]);

  // ছবি আপলোড হ্যান্ডেল করা
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await fetch(`${API_URL}/api/doctor/upload-avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const newImageUrl = data.imageUrl || data.url || data.image;
        setDoctorInfo((prev) => ({
          ...prev,
          image: newImageUrl,
        }));

        // LocalStorage আপডেট করা
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.image = newImageUrl;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

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
      href: "/dashboard/doctor/profile",
      icon: User,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col border-r border-slate-800">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Profile Box */}
      <div className="px-3 py-3.5 mb-6 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3 shadow-inner">
        {loading || isPending ? (
          <div className="flex items-center gap-3 w-full animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-700 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-slate-700 rounded w-16" />
              <div className="h-4 bg-slate-700 rounded w-24" />
            </div>
          </div>
        ) : (
          <>
            {/* Interactive Avatar Image */}
            <div className="relative group shrink-0">
              {doctorInfo.image ? (
                <img
                  src={doctorInfo.image}
                  alt={doctorInfo.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-base border-2 border-teal-400">
                  {doctorInfo.name
                    ? doctorInfo.name.charAt(0).toUpperCase()
                    : "D"}
                </div>
              )}

              {/* Upload Button Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change Avatar"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {/* Doctor Info */}
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest leading-none mb-1">
                Doctor Panel
              </p>
              <h2 className="text-sm font-bold text-white truncate leading-tight">
                {doctorInfo.name || "Doctor"}
              </h2>
              {doctorInfo.email && (
                <p className="text-[11px] text-slate-400 truncate leading-normal">
                  {doctorInfo.email}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard/doctor"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-900/30"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Exit */}
      <div className="pt-4 mt-auto border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition duration-150"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Exit Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}