'use client';
import Link from 'next/link';
import { Star, Clock, DollarSign } from 'lucide-react';

const featuredDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    experience: '12 Years',
    fee: 120,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Dr. Robert Chen',
    specialization: 'Neurology',
    experience: '10 Years',
    fee: 150,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Dr. Emily Adams',
    specialization: 'Pediatrics',
    experience: '8 Years',
    fee: 90,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1594824813566-888242a85e13?q=80&w=400&auto=format&fit=crop',
  },
];

export default function FeaturedDoctors() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Specialists</h2>
            <p className="text-slate-600 mt-2">Consult with top-rated medical experts today.</p>
          </div>
          <Link href="/doctors" className="mt-4 md:mt-0 text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1">
            View All Doctors &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between">
              <div>
                <img src={doc.image} alt={doc.name} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">{doc.specialization}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400" /> {doc.rating}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                  
                  <div className="flex items-center gap-4 text-slate-500 text-sm mt-3">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {doc.experience} exp</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${doc.fee} fee</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href={`/doctors/${doc.id}`} className="btn bg-teal-600 hover:bg-teal-700 text-white w-full border-none rounded-xl">
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}