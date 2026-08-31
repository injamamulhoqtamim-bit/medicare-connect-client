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
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // ব্যাকএন্ড থেকে নির্দিষ্ট ডাক্তারের তথ্য আনবে
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/patient/doctors`);
        const data = await res.json();

        if (data.success && Array.isArray(data.doctors)) {
          const found = data.doctors.find((d) => d.id === params?.id);
          setDoctor(found || null);
        }
      } catch (err) {
        console.error("Fetch doctor details error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchDoctorDetails();
    }
  }, [params?.id]);

  // ডিফল্ট অথবা ব্যাকএন্ডের শিডিউল স্লট
  const availableSlots = doctor?.availableSlots || [
    "09:00 AM",
    "11:00 AM",
    "02:00 PM",
    "04:30 PM",
  ];

  // বুকিং হ্যান্ডেল করার ফাংশন
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
        credentials: "include", // Authenticated patient request
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
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
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