"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  UserRound,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/patient/appointments`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load appointments"
          );
        }

        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Load appointments error:", error);

        setError(
          error.message || "Failed to load appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";

      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      case "pending":
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;

      case "cancelled":
        return <XCircle className="h-4 w-4" />;

      case "pending":
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-7 w-7 text-teal-600" />

          <h1 className="text-2xl font-bold text-slate-800">
            My Appointments
          </h1>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          View and track your doctor appointments.
        </p>
      </div>

      {/* Back to Find Doctors */}
      <Link
        href="/dashboard/patient/find-doctors"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Find Doctors
      </Link>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading your appointments...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />

            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && appointments.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />

          <h2 className="mt-4 text-lg font-semibold text-slate-700">
            No appointments yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            You have not booked any doctor appointments yet.
          </p>

          <Link
            href="/dashboard/patient/find-doctors"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <UserRound className="h-4 w-4" />
            Find a Doctor
          </Link>
        </div>
      )}

      {/* Appointments */}
      {!loading && !error && appointments.length > 0 && (
        <div className="space-y-5">
          {appointments.map((appointment) => (
            <div
              key={
                appointment._id?.$oid ||
                appointment._id?.toString() ||
                `${appointment.doctorId}-${appointment.appointmentDate}-${appointment.appointmentTime}`
              }
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {/* Top */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <UserRound className="h-7 w-7" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Dr. {appointment.doctorName}
                    </h2>

                    <p className="mt-1 text-sm text-teal-600">
                      Verified Doctor
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                    appointment.status
                  )}`}
                >
                  {getStatusIcon(appointment.status)}

                  {formatStatus(appointment.status)}
                </div>
              </div>

              {/* Doctor Email */}
              {appointment.doctorEmail && (
                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />

                  {appointment.doctorEmail}
                </div>
              )}

              {/* Appointment Details */}
              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                {/* Date */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <CalendarDays className="h-4 w-4 text-teal-600" />

                    Appointment Date
                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {formatDate(appointment.appointmentDate)}
                  </p>
                </div>

                {/* Time */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Clock className="h-4 w-4 text-teal-600" />

                    Appointment Time
                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {appointment.appointmentTime}
                  </p>
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  {appointment.status === "pending" &&
                    "Your appointment request is waiting for doctor confirmation."}

                  {appointment.status === "confirmed" &&
                    "Your appointment has been confirmed by the doctor."}

                  {appointment.status === "completed" &&
                    "This appointment has been completed."}

                  {appointment.status === "cancelled" &&
                    "This appointment has been cancelled."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}