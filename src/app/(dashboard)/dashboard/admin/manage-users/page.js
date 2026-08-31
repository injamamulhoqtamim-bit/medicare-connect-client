"use client";

import { useEffect, useState } from "react";
import { Users, Mail, RefreshCw, Loader2, Trash2, UserCheck, Stethoscope } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Endpoint not found or invalid response (${response.status})`);
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch users.");
      }

      setUsers(result.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(userId);
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete user account.");
      }

      // স্টেট আপডেট
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
    } catch (err) {
      alert(err.message || "Error deleting user");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (filterRole === "all") return true;
    return u.role === filterRole;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">View and delete patient or doctor accounts.</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterRole("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterRole === "all" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Accounts ({users.length})
        </button>
        <button
          onClick={() => setFilterRole("patient")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterRole === "patient" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Patients ({users.filter((u) => u.role === "patient").length})
        </button>
        <button
          onClick={() => setFilterRole("doctor")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterRole === "doctor" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Doctors ({users.filter((u) => u.role === "doctor").length})
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-800">
            Registered Accounts ({filteredUsers.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            <span>Loading accounts list...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No accounts found for this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((user) => {
                  const targetId = user.id || user._id;
                  const isDoctor = user.role === "doctor";

                  return (
                    <tr key={targetId} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          {isDoctor ? (
                            <Stethoscope className="w-4 h-4 text-teal-600" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-blue-600" />
                          )}
                          <span>{user.name || (isDoctor ? "Doctor" : "Patient")}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${
                            isDoctor
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {user.role || "patient"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(targetId)}
                          disabled={deletingId === targetId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                        >
                          {deletingId === targetId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}