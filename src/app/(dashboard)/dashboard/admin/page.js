'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Users, UserCheck, CalendarCheck, DollarSign } from 'lucide-react';

const doctorPerformanceData = [
  { name: 'Dr. Sarah', rating: 4.9, appointments: 120 },
  { name: 'Dr. John', rating: 4.7, appointments: 98 },
  { name: 'Dr. Emily', rating: 4.8, appointments: 110 },
  { name: 'Dr. Alan', rating: 4.5, appointments: 75 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard Overview</h1>

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-lg"><UserCheck className="w-8 h-8" /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Doctors</p>
            <h3 className="text-2xl font-bold text-slate-800">48</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users className="w-8 h-8" /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Patients</p>
            <h3 className="text-2xl font-bold text-slate-800">1,240</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><CalendarCheck className="w-8 h-8" /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Appointments</p>
            <h3 className="text-2xl font-bold text-slate-800">3,450</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign className="w-8 h-8" /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800">$45,200</h3>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Doctor Performance & Appointments Overview</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={doctorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}