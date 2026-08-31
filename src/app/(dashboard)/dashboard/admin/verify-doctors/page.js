"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Ban, AlertTriangle, Trash2, RefreshCw, Loader2, ShieldCheck } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function VerifyDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/doctors`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setDoctors(data.doctors || []);
      }
    } catch (err) {
      console.error("Fetch doctors error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id);
      const res = await fetch(`${API_URL}/api/admin/doctor-action/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDoctors();
      } else {
        alert(data.message || "Failed to perform action");
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this doctor account?")) {
      return;
    }
    try {
      setActionLoading(id);
      const res = await fetch(`${API_URL}/api/admin/doctors/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setDoctors((prev) => prev.filter((d) => (d.id || d._id) !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Verify & Manage Doctor Licenses</h1>
          <p className="text-sm text-slate-500">Approve, suspend, revoke licenses, or delete doctor profiles.</p>
        </div>
        <button
          onClick={fetchDoctors}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-900 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-teal-600" />
          Loading doctors list...
        </div>
      ) : doctors.length === 0 ? (
        <div className="p-8 text-center bg-white border rounded-2xl text-slate-500">
          No doctor accounts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {doctors.map((doc) => {
            const targetId = doc.id || doc._id;
            const isVerified = doc.verificationStatus === "verified";
            const isSuspended = doc.status === "suspended";

            return (
              <div
                key={targetId}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-slate-800">{doc.name}</h3>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase ${
                        isVerified
                          ? "bg-emerald-100 text-emerald-800"
                          : isSuspended
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {doc.verificationStatus}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Degrees:</span> {doc.degrees} |{" "}
                    <span className="font-medium text-slate-700">Specialties:</span>{" "}
                    {Array.isArray(doc.specialties) ? doc.specialties.join(", ") : doc.specialties}
                  </p>
                  <p className="text-xs text-slate-400">
                    Email: {doc.email} | Phone: {doc.phone} | Experience: {doc.experience} | Fee: ৳{doc.fee}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {!isVerified && (
                    <button
                      onClick={() => handleAction(targetId, "verify")}
                      disabled={actionLoading === targetId}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verify License
                    </button>
                  )}

                  {!isSuspended ? (
                    <button
                      onClick={() => handleAction(targetId, "suspend")}
                      disabled={actionLoading === targetId}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-medium transition"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(targetId, "approve")}
                      disabled={actionLoading === targetId}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Unsuspend
                    </button>
                  )}

                  <button
                    onClick={() => handleAction(targetId, "revoke-license")}
                    disabled={actionLoading === targetId}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-medium transition"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Revoke License
                  </button>

                  <button
                    onClick={() => handleDelete(targetId)}
                    disabled={actionLoading === targetId}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-medium transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}