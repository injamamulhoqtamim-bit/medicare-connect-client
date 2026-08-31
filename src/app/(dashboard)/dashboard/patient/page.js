"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  UserCheck,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PatientDashboardPage() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalSpent: 0,
    consultedDoctors: 0,
    totalReviews: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/patient/dashboard-overview`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load dashboard");

      setStats(data.stats || {});
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong!");
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancel = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await fetch(`${API_URL}/api/patient/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Appointment cancelled successfully!");
      fetchDashboardData();
    } catch (err) {
      alert(err.message || "Failed to cancel");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Here is a summary of your medical interactions and appointments.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-teal-100 p-3 text-teal-600">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Appointments</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalAppointments}</h3>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Paid</p>
            <h3 className="text-2xl font-bold text-slate-800">${stats.totalSpent}</h3>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Doctors Consulted</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.consultedDoctors}</h3>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Reviews Given</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalReviews}</h3>
          </div>
        </div>
      </div>

      {/* Appointment Records Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800">Appointment Records</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your booked appointments, make payments, or request rescheduling.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No appointments found.</div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      Dr. {item.doctorName}
                    </td>
                    <td className="px-6 py-4">
                      {item.appointmentDate} at {item.appointmentTime}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : item.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          item.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {item.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Pay Now Button */}
                        {item.paymentStatus !== "paid" && item.status !== "cancelled" && (
                          <Link
                            href={`/checkout/${item._id}`}
                            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700"
                          >
                            Pay Now
                          </Link>
                        )}

                        {/* Reschedule */}
                        {item.status !== "cancelled" && item.status !== "completed" && (
                          <button
                            onClick={() => alert("Redirecting to reschedule option...")}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            <RefreshCw className="h-3 w-3" /> Reschedule
                          </button>
                        )}

                        {/* Cancel */}
                        {item.status !== "cancelled" && item.status !== "completed" && (
                          <button
                            onClick={() => handleCancel(item._id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <XCircle className="h-3 w-3" /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}