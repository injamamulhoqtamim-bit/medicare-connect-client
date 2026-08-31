"use client";

import Link from "next/link";
import { useState } from "react";
import { HeartPulse, Menu, X, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const user = session?.user;
  const role = user?.role?.toLowerCase();

  // Dynamic routes based on role
  const findDoctorsHref =
    role === "patient"
      ? "/dashboard/patient/find-doctors"
      : "/doctors";

  // Dynamic Dashboard Path Calculation
  const getDashboardHref = () => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "doctor") return "/dashboard/doctor";
    if (role === "patient") return "/dashboard/patient";
    return "/dashboard/patient";
  };

  const dashboardHref = getDashboardHref();
  const appointmentsHref = "/dashboard/doctor/appointments";

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
          >
            <HeartPulse className="h-8 w-8 text-rose-600" />

            <span className="text-slate-900">
              MediCare
              <span className="text-teal-600">Connect</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-slate-700">

            {/* Home - Everyone */}
            <Link
              href="/"
              className="hover:text-teal-600 transition-colors"
            >
              Home
            </Link>

            {/* Find Doctors */}
            <Link
              href={findDoctorsHref}
              className="hover:text-teal-600 transition-colors"
            >
              Find Doctors
            </Link>

            {/* Admin / Doctor / Patient Links */}
            {user && role === "doctor" ? (
              <>
                <Link
                  href="/dashboard/doctor"
                  className="hover:text-teal-600 transition-colors"
                >
                  Dashboard
                </Link>

                <Link
                  href={appointmentsHref}
                  className="hover:text-teal-600 transition-colors"
                >
                  Appointments
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="hover:text-teal-600 transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="hover:text-teal-600 transition-colors"
                >
                  Contact Us
                </Link>

                {user && (
                  <Link
                    href={dashboardHref}
                    className="hover:text-teal-600 font-semibold text-teal-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 font-medium text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>

                <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  {user.name} ({role})
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-teal-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 font-medium">

          {user && (
            <div className="p-2 border-b border-slate-100 mb-2">
              <p className="font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{role}</p>
            </div>
          )}

          <Link
            href="/"
            className="block py-2 text-slate-700 hover:text-teal-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href={findDoctorsHref}
            className="block py-2 text-slate-700 hover:text-teal-600"
            onClick={() => setIsOpen(false)}
          >
            Find Doctors
          </Link>

          {user && role === "doctor" ? (
            <>
              <Link
                href="/dashboard/doctor"
                className="block py-2 text-slate-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/doctor/appointments"
                className="block py-2 text-slate-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                Appointments
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/about"
                className="block py-2 text-slate-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="block py-2 text-slate-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>

              {user && (
                <Link
                  href={dashboardHref}
                  className="block py-2 text-teal-600 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </>
          )}

          {user ? (
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await handleLogout();
              }}
              className="block w-full text-left py-2 text-rose-600 hover:text-rose-700 font-semibold"
            >
              Logout
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2 text-sm font-semibold text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="w-full text-center py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}