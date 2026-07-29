'use client';
import Link from 'next/link';
import { useState } from 'react';
import { HeartPulse, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Mock user state - replace with AuthContext later
  const user = null; 

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <HeartPulse className="h-8 w-8 text-rose-600" />
            <span className="text-slate-800">MediCare<span className="text-teal-600">Connect</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-slate-700">
            <Link href="/" className="hover:text-teal-600 transition">Home</Link>
            <Link href="/doctors" className="hover:text-teal-600 transition">Find Doctors</Link>
            <Link href="/about" className="hover:text-teal-600 transition">About Us</Link>
            <Link href="/contact" className="hover:text-teal-600 transition">Contact Us</Link>
            {user && (
              <Link href="/dashboard" className="hover:text-teal-600 transition">Dashboard</Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-2">
                    <img src={user?.photoURL || "https://i.ibb.co/mJRqC9L/user-avatar.png"} alt="User" />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link href="/dashboard/profile">Profile</Link></li>
                  <li><Link href="/dashboard">Dashboard</Link></li>
                  <li><button>Logout</button></li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="btn btn-outline btn-teal-600 border-teal-600 text-teal-600 hover:bg-teal-600 hover:border-teal-600">Login</Link>
                <Link href="/register" className="btn bg-teal-600 hover:bg-teal-700 text-white border-none">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-base-100 border-b px-4 pt-2 pb-4 space-y-2">
          <Link href="/" className="block py-2 text-slate-700 hover:text-teal-600">Home</Link>
          <Link href="/doctors" className="block py-2 text-slate-700 hover:text-teal-600">Find Doctors</Link>
          <Link href="/about" className="block py-2 text-slate-700 hover:text-teal-600">About Us</Link>
          <Link href="/contact" className="block py-2 text-slate-700 hover:text-teal-600">Contact Us</Link>
          {!user ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="btn btn-outline w-full">Login</Link>
              <Link href="/register" className="btn bg-teal-600 text-white w-full">Register</Link>
            </div>
          ) : (
            <Link href="/dashboard" className="block py-2 text-teal-600 font-semibold">Dashboard</Link>
          )}
        </div>
      )}
    </header>
  );
}