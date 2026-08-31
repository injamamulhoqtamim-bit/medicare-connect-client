"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  UserRound,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DoctorSchedulePage() {
  const params = useParams();
  const doctorId = params?.doctorId;

  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctorId) return;

    const loadDoctorSchedule = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/patient/doctors/${doctorId}/schedule`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load doctor schedule"
          );
        }

        setDoctor(data.doctor || null);
        setSchedules(data.schedules || []);
      } catch (error) {
        console.error("Load doctor schedule error:", error);

        setError(
          error.message || "Failed to load doctor schedule"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctorSchedule();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-600" />

        <p className="mt-3 text-sm text-slate-500">
          Loading doctor schedule...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <Link
          href="/dashboard/patient/find-doctors"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Find Doctors
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="space-y-5">
        <Link
          href="/dashboard/patient/find-doctors"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Find Doctors
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <UserRound className="mx-auto h-10 w-10 text-slate-300" />

          <h2 className="mt-3 font-semibold text-slate-700">
            Doctor not found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/patient/find-doctors"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Find Doctors
      </Link>

      {/* Doctor Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
            <UserRound className="h-10 w-10" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {doctor.name}
            </h1>

            <p className="mt-1 font-medium text-teal-600">
              Verified Doctor
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4" />
              <span>{doctor.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-100 p-3 text-teal-600">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Available Schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Doctor's consultation days and hours.
              </p>
            </div>
          </div>
        </div>

        {schedules.length === 0 ? (
          <div className="p-10 text-center">
            <Clock className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-3 font-semibold text-slate-700">
              No schedule available
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This doctor has not added any consultation schedule yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {schedules.map((schedule) => (
              <div
                key={schedule._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                    <Clock className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {schedule.day}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/patient/find-doctors/${doctorId}/book`}
                  className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}