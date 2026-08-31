"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  UserRound,
  Mail,
  CalendarDays,
  ShieldCheck,
  Ban,
  Trash2,
  FileX,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all doctors from API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/doctors`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load doctors.");
      }

      setDoctors(result.doctors || []);
    } catch (err) {
      console.error("Load doctors error:", err);
      setError(err.message || "Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Generic Action Handler: approve, suspend, verify, revoke-license
  const handleAction = async (doctorObj, action) => {
    const targetId = doctorObj.id || doctorObj._id;
    const actionTitles = {
      approve: "approve profile for",
      suspend: "suspend account for",
      verify: "verify identity & license for",
      "revoke-license": "revoke medical license for",
    };

    const confirmed = window.confirm(
      `Are you sure you want to ${actionTitles[action] || action} Dr. ${doctorObj.name || "this clinician"}?`
    );
    if (!confirmed) return;

    try {
      setActionLoading(`${targetId}-${action}`);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/admin/doctor-action/${targetId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to perform action '${action}'.`);
      }

      setMessage(result.message || "Status updated successfully.");
      await fetchDoctors();
    } catch (err) {
      setError(err.message || `Failed to perform action '${action}'.`);
    } finally {
      setActionLoading("");
    }
  };

  // Updated Delete Doctor Handler
  const handleDelete = async (doctorObj) => {
    const targetId = doctorObj.id || doctorObj._id;
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete Dr. ${doctorObj.name || "this doctor"}?`
    );
    if (!confirmed) return;

    try {
      setActionLoading(`${targetId}-delete`);
      setError("");
      setMessage("");

      // ✅ Endpoint URL corrected to plural: /doctors/${targetId}
      const response = await fetch(`${API_URL}/api/admin/doctors/${targetId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete doctor.");
      }

      setMessage(result.message || "Doctor deleted successfully.");
      setDoctors((prev) =>
        prev.filter((doc) => (doc.id || doc._id) !== targetId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete doctor.");
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Doctors & Licenses</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, verify, suspend, and manage all clinician profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDoctors}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh List
        </button>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <XCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Doctor Management Center</h2>
            <p className="text-sm text-slate-500">
              Total Registered Doctors: <span className="font-semibold text-slate-700">{doctors.length}</span>
            </p>
          </div>
        </div>

        {loading && (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
            <span className="font-medium text-sm">Loading doctors list...</span>
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <UserRound className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No Doctors Found</h3>
            <p className="text-sm text-slate-500 mt-1">There are no doctor accounts in the database.</p>
          </div>
        )}

        {!loading && doctors.length > 0 && (
          <div className="divide-y divide-slate-100">
            {doctors.map((doctor) => {
              const docId = doctor.id || doctor._id;
              const isVerified = doctor.isVerified || doctor.verificationStatus === "verified";
              const isApproved = doctor.status === "approved" || doctor.isApproved;

              return (
                <div key={docId} className="p-6 hover:bg-slate-50/70 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    
                    {/* Doctor Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-semibold text-lg overflow-hidden border">
                        {doctor.image ? (
                          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserRound className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-800">
                            {doctor.name || "Unnamed Doctor"}
                          </h3>
                          {isVerified && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 mt-1 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{doctor.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            <span>Joined {formatDate(doctor.createdAt)}</span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-700"
                                : doctor.status === "suspended"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isApproved
                                  ? "bg-emerald-500"
                                  : doctor.status === "suspended"
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {doctor.status
                              ? doctor.status.toUpperCase()
                              : isApproved
                              ? "APPROVED"
                              : "PENDING"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* APPROVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleAction(doctor, "approve")}
                        disabled={!!actionLoading || isApproved}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40"
                        title="Approve Doctor Profile"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {actionLoading === `${docId}-approve` ? "..." : "Approve"}
                      </button>

                      {/* VERIFY BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleAction(doctor, "verify")}
                        disabled={!!actionLoading || isVerified}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40"
                        title="Verify Doctor License"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        {actionLoading === `${docId}-verify` ? "..." : "Verify"}
                      </button>

                      {/* SUSPEND BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleAction(doctor, "suspend")}
                        disabled={!!actionLoading || doctor.status === "suspended"}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40"
                        title="Suspend Account"
                      >
                        <Ban className="w-4 h-4" />
                        {actionLoading === `${docId}-suspend` ? "..." : "Suspend"}
                      </button>

                      {/* REVOKE LICENSE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleAction(doctor, "revoke-license")}
                        disabled={!!actionLoading}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                        title="Revoke License"
                      >
                        <FileX className="w-4 h-4" />
                        {actionLoading === `${docId}-revoke-license` ? "..." : "Revoke License"}
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleDelete(doctor)}
                        disabled={!!actionLoading}
                        className="p-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 rounded-lg transition disabled:opacity-50 ml-1"
                        title="Delete Doctor Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}