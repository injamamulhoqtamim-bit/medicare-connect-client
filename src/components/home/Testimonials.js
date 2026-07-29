'use client';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Michael Brown',
    comment: 'Booking an appointment with Dr. Sarah was so easy! Saved me hours of waiting time.',
    rating: 5,
    role: 'Patient',
  },
  {
    id: 2,
    name: 'Sophia Wilson',
    comment: 'The digital prescription feature is amazing. Highly recommend MediCare Connect!',
    rating: 5,
    role: 'Patient',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Patient Success Stories</h2>
          <p className="text-slate-600 mt-2">Read what our patients say about their experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
              <Quote className="w-10 h-10 text-teal-100 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-4">"{rev.comment}"</p>
              <div>
                <h4 className="font-bold text-slate-900">{rev.name}</h4>
                <p className="text-xs text-slate-500">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}