'use client';

import Link from 'next/link';
import { Award, DollarSign, Stethoscope } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  // Fallback demo data with actual API fields
  const doc = doctor || {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    degree: 'MBBS, MD',
    experienceYears: 12,
    consultationFee: 1200,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
  };

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:shadow-xl">
      <div>
        {/* Doctor Image */}
        <div className="relative h-56 w-full bg-slate-100">
          <img
            src={doc.image || '/default-avatar.png'}
            alt={doc.name || 'Doctor'}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Doctor Info */}
        <div className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              {doc.specialty || 'General Physician'}
            </span>
            <span className="text-xs text-slate-400">
              {doc.degree || 'MBBS'}
            </span>
          </div>

          <h3 className="mb-1 text-xl font-bold text-slate-900">
            {doc.name || 'Dr. Anonymous'}
          </h3>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-teal-600" />
              <span>{doc.experienceYears || 0} Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-teal-600" />
              <span>Fee: ৳{doc.consultationFee || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Action */}
      <div className="p-6 pt-0">
        <Link
          href={`/doctors/${doc.id}`}
          className="btn block w-full rounded-xl border-none bg-teal-600 py-3 text-center text-sm font-medium text-white transition hover:bg-teal-700"
        >
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}