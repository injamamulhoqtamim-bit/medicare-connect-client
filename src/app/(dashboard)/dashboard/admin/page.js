"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Stethoscope,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ডেমো চার্ট ডেটা
const doctorPerformanceData = [
  { name: "Dr. Sarah", rating: 4.9, appointments: 120 },
  { name: "Dr. John", rating: 4.7, appointments: 98 },
  { name: "Dr. Emily", rating: 4.8, appointments: 110 },
  { name: "Dr. Alan", rating: 4.5, appointments: 75 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVerifiedDoctors: 0,
    allBookings: 0,
    totalPays: 0,
    doctorsWithPaidPatients: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/admin/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 👈 সেশন কুকি পাস করার জন্য অত্যন্ত জরুরি
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized: Please login again as an Admin.");
      }

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.message || "Failed to fetch stats.");
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "TOTAL PATIENTS",
      value: stats.totalPatients,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "VERIFIED CLINICIANS",
      value: stats.totalVerifiedDoctors,
      icon: UserCheck,
      color: "text-teal-600 bg-teal-50",
    },
    {
      title: "ALL BOOKINGS",
      value: stats.allBookings,
      icon: Calendar,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "GROSS CO-PAYS",
      value: `$${stats.totalPays}`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-2 font-medium">Loading Dashboard Analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium text-sm">{error}</p>
          <button
            onClick={fetchStats}
            className="ml-auto text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Admin Dashboard Overview
      </h1>

      {/* Dynamic Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {card.title}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Paid Consultations Insight Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl shrink-0">
          <Stethoscope className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-800">
            Paid Doctor Consultations
          </h4>
          <p className="text-slate-500 text-sm">
            Total{" "}
            <span className="font-bold text-teal-600">
              {stats.doctorsWithPaidPatients}
            </span>{" "}
            doctors currently have active appointments with completed patient payments.
          </p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Doctor Performance & Appointments Overview
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={doctorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="appointments"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}