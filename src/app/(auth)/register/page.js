'use client';
import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, HeartPulse, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient', // default role
  });

  const handleRegister = (e) => {
    e.preventDefault();
    // এখানে আপনার Registration API বা AuthContext ডিল করবেন
    alert(`Registered successfully as ${formData.role}!`);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <HeartPulse className="h-8 w-8 text-rose-500" />
            <span>MediCare<span className="text-teal-600">Connect</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Create an Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join MediCare Connect today.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="John Doe"
                className="input input-bordered w-full pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                className="input input-bordered w-full pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input input-bordered w-full pl-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Account Type / Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">I am registering as a</label>
            <div className="relative">
              <UserCheck className="w-5 h-5 absolute left-3 top-3 text-slate-400 z-10" />
              <select
                className="select select-bordered w-full pl-10"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-teal-600 hover:bg-teal-700 text-white border-none w-full flex items-center gap-2 mt-6"
          >
            <UserPlus className="w-4 h-4" /> Register Account
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>

      </div>
    </main>
  );
}