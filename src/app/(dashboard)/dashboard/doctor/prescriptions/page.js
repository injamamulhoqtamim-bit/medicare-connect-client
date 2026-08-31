"use client";

import React from "react";

export default function DoctorPrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Prescriptions
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and manage patient prescriptions.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Prescription page content goes here.</p>
      </div>
    </div>
  );
}