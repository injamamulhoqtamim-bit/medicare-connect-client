"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Star,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Award,
} from "lucide-react";

export default function DoctorDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // ১. ব্যাকএন্ড থেকে ডাক্তারের প্রোফাইল এবং আসল শিডিউল লোড করা
  useEffect(() => {
    const fetchDoctorDetailsAndSchedule = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // ডক্টর ডিটেইলস আনা
        const docRes = await fetch(`${baseUrl}/api/patient/doctors`);
        const docData = await docRes.json();

        if (docData.success && Array.isArray(docData.doctors)) {
          const found = docData.doctors.find((d) => d.id === params?.id);
          setDoctor(found || null);
        }

        // ডক্টরের শিডিউল (Days & Time) আনা
        if (params?.id) {
          const schedRes = await fetch(
            `${baseUrl}/api/patient/doctors/${params.id}/schedule`,
            { credentials: "include" }
          );
          const schedData = await schedRes.json();
          if (schedData.success && Array.isArray(schedData.schedules)) {
            setSchedules(schedData.schedules);
          }
        }
      } catch (err) {
        console.error("Fetch doctor details error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchDoctorDetailsAndSchedule();
    }
  }, [params?.id]);

  // ইউনিক এভেলেবল দিনগুলো (Days) বের করা
  const availableDays = [
    ...new Set(schedules.map((s) => s.day).filter(Boolean)),
  ];

  // ডুপ্লিকেট স্লট রিমুভ করে ইউনিক স্লট বের করা
  const rawSlots = schedules.map((s) => `${s.startTime} - ${s.endTime}`);
  const availableSlots =
    schedules.length > 0
      ? [...new Set(rawSlots.filter((slot) => slot && slot !== "undefined - undefined"))]
      : ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM"];

  // ডেট সিলেক্ট করার সময় চেক করা যে বারটি ডাক্তারের এভেলেবল কি না
  const handleDateChange = (e) => {
    const chosenDate = new Date(e.target.value);
    if (isNaN(chosenDate)) return;

    const dayName = chosenDate.toLocaleDateString("en-US", { weekday: "long" });

    if (availableDays.length > 0 && !availableDays.includes(dayName)) {
      alert(
        `Doctor is only available on: ${availableDays.join(
          ", "
        )}. Please select a valid day.`
      );
      setSelectedDate("");
      return;
    }

    setSelectedDate(e.target.value);
  };

  // বুকিং হ্যান্ডেল করা
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert("Please select both a date and a time slot.");
      return;
    }

    try {
      setBookingLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${baseUrl}/api/patient/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          doctorId: doctor.id,
          appointmentDate: selectedDate,
          appointmentTime: selectedSlot,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(
          `Appointment successfully booked with ${doctor.name} for ${selectedDate} at ${selectedSlot}!`
        );
        setSelectedDate("");
        setSelectedSlot("");
      } else {
        alert(data.message || "Failed to book appointment. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong while booking your appointment.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold text-slate-600">
        Loading Doctor Profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Doctor Not Found!</h2>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 font-semibold text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Doctors
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/doctors"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to All Doctors
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Doctor Info Section */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-start">
            <img
              src={doctor.image || "/default-avatar.png"}
              alt={doctor.name}
              className="h-40 w-40 rounded-2xl object-cover bg-slate-100"
            />
            <div className="space-y-2 text-center md:text-left">
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                {doctor.specialty || "General Physician"}
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                {doctor.name}
              </h1>
              <p className="text-sm font-medium text-slate-500">
                {doctor.degree || "MBBS"}
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-2 text-sm text-slate-600 md:justify-start">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />{" "}
                  {doctor.rating || "4.9"}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-teal-600" />{" "}
                  {doctor.experienceYears || 0} Years Exp
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-teal-600" /> ৳
                  {doctor.consultationFee || 0} Fee
                </span>
              </div>

              {doctor.bmdcRegNum && (
                <p className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500 md:justify-start">
                  <MapPin className="h-4 w-4 text-teal-600" /> BMDC Reg:{" "}
                  {doctor.bmdcRegNum}
                </p>
              )}
            </div>
          </div>

          {/* About Doctor */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              About Doctor
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {doctor.about ||
                `${doctor.name} is a dedicated ${
                  doctor.specialty || "medical specialist"
                } committed to providing high-quality healthcare and compassionate patient treatment.`}
            </p>
          </div>
        </div>

        {/* Appointment Booking Box */}
        <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
            <Calendar className="h-5 w-5 text-teal-600" /> Book Appointment
          </h2>

          {/* Available Days Section */}
          <div className="mb-4 rounded-xl bg-slate-50 p-3">
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
              <Clock className="h-3.5 w-3.5 text-teal-600" /> Available Days (Week)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableDays.length > 0 ? (
                availableDays.map((day) => (
                  <span
                    key={day}
                    className="rounded-lg bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800"
                  >
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">
                  No fixed weekly schedule set yet.
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Select Date
              </label>
              <input
                type="date"
                required
                className="input input-bordered w-full rounded-xl border-slate-200 px-3 py-2 text-slate-700 outline-none focus:border-teal-600"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={`${slot}-${idx}`}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition ${
                      selectedSlot === slot
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-500"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="btn mt-6 flex w-full items-center justify-center gap-2 border-none bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />{" "}
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}