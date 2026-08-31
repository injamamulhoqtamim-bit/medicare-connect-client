"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Clock, Star, MessageSquare, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DoctorOverviewPage() {
  const [stats, setStats] = useState({
    patients: 0,
    pendings: 0,
    reviewScore: 0,
    feedbackCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isUnverified, setIsUnverified] = useState(false);
  const [error, setError] = useState("");

  // Load Overview Stats
  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      setIsUnverified(false);

      const response = await fetch(`${API_URL}/api/doctor/overview-stats`, {
        method: "GET",
        credentials: "include",
      });

      // 1. Account Unverified/Forbidden check (Handle 403 status gracefully)
      if (response.status === 403) {
        setIsUnverified(true);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load stats");
      }

      setStats({
        patients: data.patients || 0,
        pendings: data.pendings || 0,
        reviewScore: data.reviewScore || 0,
        feedbackCount: data.feedbackCount || 0,
      });
    } catch (err) {
      // 2. Suppress unverified handling from logging as a hard server breakdown
      if (!isUnverified) {
        console.error("Load stats error:", err);
        setError(err.message || "Failed to load dashboard overview stats");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Here is a summary of your activity.
        </p>
      </div>

      {/* Account Verification Pending Alert Banner */}
      {isUnverified && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-amber-900">
                Account Verification Pending
              </h3>
              <p className="text-sm text-amber-700">
                Your profile credentials are currently under review by the
                Administrator. Overview statistics and schedule management will
                unlock once your profile is verified.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/doctor/profile"
                  className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-amber-700"
                >
                  Update Profile Credentials
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generic Error Message */}
      {error && !isUnverified && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      ) : (
        !isUnverified && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Patients */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-teal-100 p-3.5 text-teal-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Patients</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stats.patients}
                </h3>
              </div>
            </div>

            {/* Pendings */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-amber-100 p-3.5 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Pendings</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stats.pendings}
                </h3>
              </div>
            </div>

            {/* Review Score */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-yellow-100 p-3.5 text-yellow-600">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Review Score</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stats.reviewScore}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    / 5.0
                  </span>
                </h3>
              </div>
            </div>

            {/* Feedback */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-indigo-100 p-3.5 text-indigo-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Feedback</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stats.feedbackCount}
                </h3>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}