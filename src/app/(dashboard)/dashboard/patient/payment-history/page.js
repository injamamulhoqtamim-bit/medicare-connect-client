"use client";

import { CreditCard } from "lucide-react";

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payment History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track all your appointment payments and transactions.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <CreditCard className="mx-auto h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-700">No Payment Records</h2>
        <p className="mt-2 text-sm text-slate-500">
          Your payment history will appear here once you complete a booking payment.
        </p>
      </div>
    </div>
  );
}