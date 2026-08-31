"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, LayoutGrid, List, Award, Calendar, Star } from "lucide-react";

export default function FindDoctorsPublicPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [sortBy, setSortBy] = useState("fee-low");
  const [viewMode, setViewMode] = useState("grid");

  // ১. ব্যাকএন্ড থেকে কেবল "Verified" ডাক্তারদের ডাটা ফেচ করা
  useEffect(() => {
    const fetchVerifiedDoctors = async () => {
      try {
        setLoading(true);
        // আপনার ব্যাকএন্ড API এন্ডপয়েন্ট অনুযায়ী পরিবর্তন করতে পারেন
        const res = await fetch("http://localhost:5000/api/patient/doctors");
        const data = await res.json();
        
        if (data.success) {
          setDoctors(data.doctors || []);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedDoctors();
  }, []);

  // স্পেশালাইজেশনের লিস্ট তৈরি (ডাইনামিক + ডিফল্ট)
  const specializations = [
    "All",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
  ];

  // ২. ফিল্টারিং এবং সর্টিং লজিক
  const filteredDoctors = doctors
    .filter((doc) => {
      // নাম অনুযায়ী ফিল্টার
      const matchesName = doc.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      // স্পেশালাইজেশন অনুযায়ী ফিল্টার
      const docSpec = Array.isArray(doc.specialties) 
        ? doc.specialties.join(", ") 
        : doc.specialties || doc.degree || "";
        
      const matchesSpec =
        selectedSpec === "All" ||
        docSpec.toLowerCase().includes(selectedSpec.toLowerCase());

      return matchesName && matchesSpec;
    })
    .sort((a, b) => {
      // সর্টিং লজিক
      const feeA = Number(a.consultationFee || a.fee || 0);
      const feeB = Number(b.consultationFee || b.fee || 0);
      const expA = Number(a.experience || 0);
      const expB = Number(b.experience || 0);

      if (sortBy === "fee-low") return feeA - feeB;
      if (sortBy === "fee-high") return feeB - feeA;
      if (sortBy === "experience") return expB - expA;
      return 0;
    });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Find Expert Doctors
        </h1>
        <p className="mt-2 text-slate-600">
          Search and book top verified healthcare specialists easily.
        </p>
      </div>

      {/* Control Bar: Search + Filter + Sort + Layout */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-md md:flex-row">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctor by name..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Specialization */}
        <div className="w-full md:w-1/4">
          <select
            className="select select-bordered w-full"
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="w-full md:w-1/4">
          <select
            className="select select-bordered w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex overflow-hidden rounded-lg border">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 ${
              viewMode === "grid"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2.5 ${
              viewMode === "table"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="loading loading-spinner loading-lg text-teal-600"></div>
          <p className="mt-4 text-slate-500">Loading verified doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-600">
            No verified doctors found.
          </p>
          <p className="text-sm text-slate-400">
            Try adjusting your search criteria or specialization filter.
          </p>
        </div>
      ) : (
        /* Doctors Display */
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id || doc.id}
                  className="flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          doc.image ||
                          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop"
                        }
                        alt={doc.name}
                        className="h-16 w-16 rounded-full object-cover border border-slate-100"
                      />
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-semibold text-teal-600">
                          {Array.isArray(doc.specialties)
                            ? doc.specialties.join(", ")
                            : doc.specialties || doc.degree || "Specialist"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {doc.degrees || doc.degree}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t pt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-slate-400" />
                        <span>Experience: <strong>{doc.experience || 0} Years</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">৳</span>
                        <span>
                          Consultation Fee:{" "}
                          <strong className="text-slate-900">
                            ৳{doc.consultationFee || doc.fee || 0}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/doctors/${doc._id || doc.id}`}
                      className="btn w-full bg-teal-600 text-white hover:bg-teal-700 border-none"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
              <table className="table w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doc) => (
                    <tr key={doc._id || doc.id} className="hover:bg-slate-50">
                      <td className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="h-12 w-12 rounded-full">
                            <img
                              src={
                                doc.image ||
                                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop"
                              }
                              alt={doc.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{doc.name}</div>
                          <div className="text-xs text-slate-500">
                            {doc.degrees || doc.degree}
                          </div>
                        </div>
                      </td>
                      <td>
                        {Array.isArray(doc.specialties)
                          ? doc.specialties.join(", ")
                          : doc.specialties || doc.degree}
                      </td>
                      <td>{doc.experience || 0} Years</td>
                      <td className="font-bold text-slate-800">
                        ৳{doc.consultationFee || doc.fee || 0}
                      </td>
                      <td className="text-right">
                        <Link
                          href={`/doctors/${doc._id || doc.id}`}
                          className="btn btn-sm bg-teal-600 text-white border-none hover:bg-teal-700"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Pagination (Optional UI) */}
      {!loading && filteredDoctors.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button className="btn btn-outline btn-sm" disabled>
            Previous
          </button>
          <button className="btn btn-sm bg-teal-600 text-white border-none">
            1
          </button>
          <button className="btn btn-outline btn-sm" disabled>
            Next
          </button>
        </div>
      )}
    </main>
  );
}