"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState([]);

  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/doctor/schedule`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load schedule");
      }

      setSchedules(data.schedules || []);
    } catch (error) {
      console.error("Load schedule error:", error);
      setError(error.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!day || !startTime || !endTime) {
      setError("Please select day, start time and end time.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      setAdding(true);

      const response = await fetch(`${API_URL}/api/doctor/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          day,
          startTime,
          endTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add schedule");
      }

      // MongoDB id/DB fallback handling
      const addedSchedule = data.schedule || data.data;
      if (addedSchedule) {
        setSchedules((current) => [...current, addedSchedule]);
      } else {
        await loadSchedules();
      }

      setSuccess("Schedule added successfully.");
      setDay("Monday");
      setStartTime("09:00");
      setEndTime("13:00");
    } catch (error) {
      console.error("Add schedule error:", error);
      setError(error.message || "Failed to add schedule");
    } finally {
      setAdding(false);
    }
  };

  const removeSchedule = async (scheduleId) => {
    if (!scheduleId) return;

    setError("");
    setSuccess("");

    try {
      setRemovingId(scheduleId);

      const response = await fetch(
        `${API_URL}/api/doctor/schedule/${scheduleId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove schedule");
      }

      setSchedules((current) =>
        current.filter(
          (schedule) => (schedule._id || schedule.id) !== scheduleId
        )
      );

      setSuccess("Schedule removed successfully.");
    } catch (error) {
      console.error("Remove schedule error:", error);
      setError(error.message || "Failed to remove schedule");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Doctor Schedule
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your available days and consultation hours.
        </p>
      </div>

      {/* Navigation Card */}
      <Link
        href="/dashboard/doctor/appointments"
        className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-teal-100 p-3 text-teal-600">
            <ClipboardList className="h-6 w-6" />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">Patient Appointments</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review and manage your patient appointments.
            </p>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600" />
      </Link>

      {/* Error & Success Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* Add Schedule Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-teal-100 p-3 text-teal-600">
            <CalendarDays className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Add Availability
            </h2>
            <p className="text-sm text-slate-500">
              Set the days and times when patients can book appointments.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddSchedule} className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Day
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500"
              disabled={adding}
            >
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500"
              disabled={adding}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500"
              disabled={adding}
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={adding}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-5 w-5" />
              {adding ? "Adding..." : "Add Schedule"}
            </button>
          </div>
        </form>
      </div>

      {/* Schedule List Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800">
            Your Availability
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Current consultation schedule.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading your schedule...
            </div>
          ) : schedules.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No schedule added yet.
            </div>
          ) : (
            schedules.map((schedule, index) => {
              const currentId = schedule._id || schedule.id || index;
              return (
                <div
                  key={currentId}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition"
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

                  <button
                    type="button"
                    onClick={() => removeSchedule(schedule._id || schedule.id)}
                    disabled={removingId === (schedule._id || schedule.id)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {removingId === (schedule._id || schedule.id)
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}