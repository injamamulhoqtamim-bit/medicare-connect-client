'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LogIn, Mail, Lock, HeartPulse } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // এখানে আপনার Authentication API বা AuthContext ডিল করবেন
    alert(`Logging in with: ${email}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <HeartPulse className="h-8 w-8 text-rose-500" />
            <span>MediCare<span className="text-teal-600">Connect</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Please enter your credentials to log in.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                className="input input-bordered w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <a href="#" className="text-xs text-teal-600 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input input-bordered w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-teal-600 hover:bg-teal-700 text-white border-none w-full flex items-center gap-2 mt-6"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-teal-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </main>
  );
}