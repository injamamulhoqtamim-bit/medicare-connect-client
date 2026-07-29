'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ShieldCheck, Stethoscope } from 'lucide-react';

export default function Banner() {
  return (
    <section className="relative bg-gradient-to-r from-teal-50 to-cyan-50 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Animated Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              <ShieldCheck className="w-4 h-4" /> Trusted Healthcare Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Your Health, Our <span className="text-teal-600">Priority</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Connect with top-certified specialists, book instant appointments, and manage your health records effortlessly with MediCare Connect.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/doctors" className="btn bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg shadow-lg">
                <Calendar className="w-5 h-5" /> Book Appointment
              </Link>
              <Link href="/about" className="btn btn-outline border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-3 rounded-lg text-lg">
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Animated Visual Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-300 rounded-full filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 right-4 w-72 h-72 bg-cyan-300 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
                alt="Doctor consultation"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-[400px]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}