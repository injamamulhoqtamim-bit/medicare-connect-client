'use client';
import Link from 'next/link';
import { Star, Clock, DollarSign } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  // Fallback demo data in case props aren't passed
  const doc = doctor || {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    experience: '12 Years',
    fee: 120,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between">
      <div>
        <img src={doc.image} alt={doc.name} className="w-full h-56 object-cover" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
              {doc.specialization}
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" /> {doc.rating}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
          
          <div className="flex items-center gap-4 text-slate-500 text-sm mt-3">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {doc.experience}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${doc.fee}</span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link href={`/doctors/${doc.id}`} className="btn bg-teal-600 hover:bg-teal-700 text-white w-full border-none rounded-xl">
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}