"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  CircleCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/doctor/appointments`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load appointments");
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Load appointments error:", err);
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/doctor/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update appointment");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === appointmentId ? data.appointment : appointment
        )
      );

      setSuccess(data.message);
    } catch (err) {
      console.error("Update appointment error:", err);
      setError(err.message || "Failed to update appointment");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your patient appointments and consultation status.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Appointment List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800">
            Patient Appointments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage your upcoming appointments.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-700">
              No appointments yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Patient appointments will appear here once they book with you.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Patient */}
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-teal-100 p-3 text-teal-600">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {appointment.patientName || "Patient"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {appointment.patientEmail || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-teal-600" />
                      <span>
                        {appointment.appointmentDate || "Date not set"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span>
                        {appointment.appointmentTime || "Time not set"}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        appointment.status
                      )}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {(!appointment.status ||
                      appointment.status === "pending") && (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            updateStatus(appointment._id, "confirmed")
                          }
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Confirm
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            updateStatus(appointment._id, "cancelled")
                          }
                          className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === "confirmed" && (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            updateStatus(appointment._id, "completed")
                          }
                          className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          <CircleCheck className="h-4 w-4" />
                          Complete
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            updateStatus(appointment._id, "cancelled")
                          }
                          className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}