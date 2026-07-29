'use client';
import Link from 'next/link';
import { Bell, User, HeartPulse } from 'lucide-react';

export default function DashboardNav() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <HeartPulse className="h-6 w-6 text-rose-500" />
          <span>MediCare<span className="text-teal-600">Connect</span></span>
        </Link>
        <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-semibold">Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-800 leading-tight">User Account</p>
            <p className="text-xs text-slate-500">Dashboard Area</p>
          </div>
        </div>
      </div>
    </header>
  );
}