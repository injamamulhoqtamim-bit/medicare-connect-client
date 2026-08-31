'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Brain, Bone, Baby, Sparkles, Activity } from 'lucide-react';

const initialSpecializations = [
  { name: 'Cardiology', icon: Heart, desc: 'Heart and vascular care', color: 'bg-red-100 text-red-600' },
  { name: 'Neurology', icon: Brain, desc: 'Brain and nervous system', color: 'bg-purple-100 text-purple-600' },
  { name: 'Orthopedics', icon: Bone, desc: 'Bone and joint health', color: 'bg-amber-100 text-amber-600' },
  { name: 'Pediatrics', icon: Baby, desc: 'Child health and development', color: 'bg-blue-100 text-blue-600' },
  { name: 'Dermatology', icon: Sparkles, desc: 'Skin and hair care', color: 'bg-pink-100 text-pink-600' },
  { name: 'General Medicine', icon: Activity, desc: 'Overall health & diagnosis', color: 'bg-teal-100 text-teal-600' },
];

export default function Specializations() {
  const [doctorCounts, setDoctorCounts] = useState({});

  useEffect(() => {
    const fetchDoctorCounts = async () => {
      try {
        // API Base URL (env ফাইল থেকে নিবে, না থাকলে fallback হিসেবে 5000 পোর্ট ব্যবহার করবে)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/patient/doctors`);

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.doctors)) {
          const counts = {};
          data.doctors.forEach((doc) => {
            const spec = doc.specialty || 'General Medicine';
            counts[spec] = (counts[spec] || 0) + 1;
          });
          setDoctorCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching dynamic specialization counts:', error);
      }
    };

    fetchDoctorCounts();
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">Medical Specializations</h2>
          <p className="mt-2 text-slate-600">Find specialists tailored to your health needs</p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {initialSpecializations.map((item, index) => {
            const Icon = item.icon;
            const count = doctorCounts[item.name] || 0;

            return (
              <Link
                key={index}
                href={`/doctors?specialty=${encodeURIComponent(item.name)}`}
                className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition duration-300 hover:shadow-lg"
              >
                <div className={`mb-4 rounded-2xl p-4 ${item.color} transition duration-300 group-hover:scale-110`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-1 text-base font-bold text-slate-800">{item.name}</h3>
                <p className="text-xs text-slate-500">
                  {count > 0 ? `${count} Doctor${count > 1 ? 's' : ''} Available` : item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}