'use client';
import { HeartPulse, Target, ShieldCheck, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          About MediCare Connect
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-4">
          Revolutionizing Patient Healthcare & Doctor Connectivity
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          MediCare Connect is designed to simplify healthcare management by bridging the gap between patients and medical professionals through seamless digital solutions.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
          <div className="p-3 bg-teal-600 text-white rounded-xl w-fit mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            To make healthcare accessible, efficient, and hassle-free for everyone by offering instant appointment scheduling, verified specialist listings, and secure digital health record management.
          </p>
        </div>

        <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
          <div className="p-3 bg-rose-500 text-white rounded-xl w-fit mb-4">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            To build a modern digital healthcare ecosystem where every patient can find the right doctor at the right time without long queue delays or administrative burden.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-teal-900 text-white p-10 rounded-3xl mb-12">
        <h2 className="text-3xl font-bold text-center mb-10">Our Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <ShieldCheck className="w-10 h-10 text-teal-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Verified Specialists</h3>
            <p className="text-teal-100 text-sm">Every doctor listed on our platform undergoes rigorous verification.</p>
          </div>
          <div className="text-center">
            <Users className="w-10 h-10 text-teal-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Patient Centricity</h3>
            <p className="text-teal-100 text-sm">We prioritize patient convenience, data privacy, and seamless experience.</p>
          </div>
          <div className="text-center">
            <HeartPulse className="w-10 h-10 text-teal-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Quality Care</h3>
            <p className="text-teal-100 text-sm">Ensuring fast access to medical consultations whenever needed.</p>
          </div>
        </div>
      </div>
    </main>
  );
}