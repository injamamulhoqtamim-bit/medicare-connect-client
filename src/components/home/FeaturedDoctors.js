'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DoctorCard from '../doctors/DoctorCard';

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/patient/doctors`);
        const data = await res.json();
        if (data.success) {
          setDoctors(data.doctors.slice(0, 3)); // প্রথম ৩ জনকে হোমে দেখাবে
        }
      } catch (err) {
        console.error('Featured doctors fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Specialists</h2>
            <p className="mt-1 text-slate-600">Consult with top-rated medical experts today.</p>
          </div>
          <Link href="/doctors" className="font-semibold text-teal-600 hover:text-teal-700">
            View All Doctors →
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center">Loading featured doctors...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}