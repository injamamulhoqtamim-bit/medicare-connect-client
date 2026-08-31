"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  Mail,
  UserRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const dayOrder = {
  Saturday: 1,
  Sunday: 2,
  Monday: 3,
  Tuesday: 4,
  Wednesday: 5,
  Thursday: 6,
  Friday: 7,
};

const jsDayToName = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function generateTimeSlots(startTime, endTime) {
  const slots = [];

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes < endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;

    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");

    slots.push(`${formattedHour}:${formattedMinute}`);

    currentMinutes += 30;
  }

  return slots;
}

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();

  const doctorId = params?.doctorId;

  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

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
            data.message || "Failed to load doctor information"
          );
        }

        setDoctor(data.doctor || null);
        setSchedules(data.schedules || []);
      } catch (error) {
        console.error("Load booking page error:", error);

        setError(
          error.message || "Failed to load doctor information"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctorSchedule();
  }, [doctorId]);

  const selectedDay = useMemo(() => {
    if (!appointmentDate) return "";

    const date = new Date(`${appointmentDate}T00:00:00`);

    return jsDayToName[date.getDay()];
  }, [appointmentDate]);

  const availableSchedules = useMemo(() => {
    if (!selectedDay) return [];

    return schedules
      .filter((schedule) => schedule.day === selectedDay)
      .sort((a, b) => {
        return (
          (a.dayOrder || dayOrder[a.day] || 99) -
          (b.dayOrder || dayOrder[b.day] || 99)
        );
      });
  }, [schedules, selectedDay]);

  const availableTimeSlots = useMemo(() => {
    if (availableSchedules.length === 0) return [];

    const slots = [];

    availableSchedules.forEach((schedule) => {
      const scheduleSlots = generateTimeSlots(
        schedule.startTime,
        schedule.endTime
      );

      scheduleSlots.forEach((time) => {
        if (!slots.includes(time)) {
          slots.push(time);
        }
      });
    });

    return slots.sort();
  }, [availableSchedules]);

  useEffect(() => {
    setAppointmentTime("");
  }, [appointmentDate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!appointmentDate || !appointmentTime) {
      setError("Please select appointment date and time.");
      return;
    }

    if (!doctorId) {
      setError("Doctor information is missing.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/patient/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            doctorId,
            appointmentDate,
            appointmentTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to book appointment"
        );
      }

      setSuccess(
        data.message || "Appointment booked successfully"
      );

      setAppointmentTime("");

      setTimeout(() => {
        router.push("/dashboard/patient/my-appointments");
      }, 1200);
    } catch (error) {
      console.error("Book appointment error:", error);

      setError(
        error.message || "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-600" />

        <p className="mt-3 text-sm text-slate-500">
          Loading appointment details...
        </p>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="space-y-5">
        <Link
          href={`/dashboard/patient/find-doctors/${doctorId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Doctor Schedule
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

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href={`/dashboard/patient/find-doctors/${doctorId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Doctor Schedule
      </Link>

      {/* Doctor Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
            <UserRound className="h-10 w-10" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Book Appointment
            </h1>

            <p className="mt-1 font-semibold text-slate-700">
              Dr. {doctor?.name}
            </p>

            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4" />
              {doctor?.email}
            </p>

            <p className="mt-2 text-sm font-medium text-teal-600">
              Verified Doctor
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-100 p-3 text-teal-600">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Select Appointment
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose an available date and consultation time.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleBookAppointment}
          className="space-y-6 p-6"
        >
          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Appointment Date
            </label>

            <input
              type="date"
              min={today}
              value={appointmentDate}
              onChange={(e) => {
                setAppointmentDate(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            {selectedDay && (
              <p className="mt-2 text-sm text-slate-500">
                Selected day:{" "}
                <span className="font-semibold text-teal-600">
                  {selectedDay}
                </span>
              </p>
            )}
          </div>

          {/* Available Schedule */}
          {appointmentDate && (
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Available Time
              </label>

              {availableTimeSlots.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />

                    <span>
                      No consultation schedule is available on{" "}
                      <strong>{selectedDay}</strong>.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setAppointmentTime(time);
                        setError("");
                      }}
                      className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                        appointmentTime === time
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700"
                      }`}
                    >
                      <Clock className="mx-auto mb-1 h-4 w-4" />

                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Information */}
          {appointmentDate && appointmentTime && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
              <h3 className="font-semibold text-slate-800">
                Appointment Summary
              </h3>

              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Doctor:</span>{" "}
                  Dr. {doctor?.name}
                </p>

                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {appointmentDate}
                </p>

                <p>
                  <span className="font-medium">Day:</span>{" "}
                  {selectedDay}
                </p>

                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {appointmentTime}
                </p>
              </div>
            </div>
          )}

          {/* Book Button */}
          <button
            type="submit"
            disabled={
              booking ||
              !appointmentDate ||
              !appointmentTime
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {booking ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Booking Appointment...
              </>
            ) : (
              <>
                <CalendarDays className="h-5 w-5" />
                Confirm Appointment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}