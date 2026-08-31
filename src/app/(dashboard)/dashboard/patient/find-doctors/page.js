"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UserRound,
  Mail,
  CalendarDays,
  ArrowRight,
  Search,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/patient/doctors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load doctors");
        }

        // Handle both direct array or nested object response
        const doctorsList = Array.isArray(data)
          ? data
          : data.doctors || data.data || [];

        setDoctors(doctorsList);
      } catch (err) {
        console.error("Load doctors error:", err);
        setError(err.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Safe search filtering
  const filteredDoctors = doctors.filter((doctor) => {
    const doctorName = doctor?.name || doctor?.user?.name || "";
    const doctorEmail = doctor?.email || doctor?.user?.email || "";
    const searchTerm = search.toLowerCase().trim();

    return (
      doctorName.toLowerCase().includes(searchTerm) ||
      doctorEmail.toLowerCase().includes(searchTerm)
    );
  });

  // Helper function to resolve image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Find a Doctor</h1>
        <p className="mt-1 text-sm text-slate-500">
          Choose a verified doctor and book an appointment.
        </p>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor by name or email..."
            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-teal-600" />
          <p className="mt-3 text-sm text-slate-500">Loading doctors...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <UserRound className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="mt-3 font-semibold text-slate-700">No doctors found</h2>
          <p className="mt-1 text-sm text-slate-500">Try a different search.</p>
        </div>
      )}

      {/* Doctors List Grid */}
      {!loading && !error && filteredDoctors.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => {
            const docId = doctor._id || doctor.id || doctor.userId;
            const docName = doctor.name || doctor.user?.name || "Doctor";
            const docEmail = doctor.email || doctor.user?.email || "N/A";
            const docImage = getImageUrl(doctor.image || doctor.user?.image);

            return (
              <div
                key={docId}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Doctor Avatar & Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full border border-teal-100 bg-teal-100 text-teal-700">
                    {docImage ? (
                      <Image
                        src={docImage}
                        alt={docName}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <UserRound className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-slate-800">
                      {docName}
                    </h2>
                    <p className="text-sm font-medium text-teal-600">
                      {doctor.specialty || doctor.specialties || "Verified Doctor"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{docEmail}</span>
                </div>

                {/* Action Button */}
                <Link
                  href={`/dashboard/patient/find-doctors/${docId}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <CalendarDays className="h-4 w-4" />
                  View Schedule
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}