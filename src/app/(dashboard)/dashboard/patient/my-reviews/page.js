"use client";

import { Star } from "lucide-react";

export default function MyReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and view reviews given to your doctors.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <Star className="mx-auto h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-700">No Reviews Yet</h2>
        <p className="mt-2 text-sm text-slate-500">
          You haven't submitted any reviews for doctors yet.
        </p>
      </div>
    </div>
  );
}