'use client';
import { ShieldCheck, Clock, FileText, Headphones } from 'lucide-react';

const features = [
  { title: 'Verified Specialists', desc: 'All doctors are thoroughly vetted and verified by admins.', icon: ShieldCheck },
  { title: 'Instant Booking', desc: 'No long waiting times. Book your preferred time slots instantly.', icon: Clock },
  { title: 'Digital Health Records', desc: 'Easily view and download prescriptions and medical history.', icon: FileText },
  { title: '24/7 Support', desc: 'Dedicated customer support for all your medical queries.', icon: Headphones },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose MediCare Connect?</h2>
          <p className="text-slate-600 mt-2">Empowering your healthcare journey with modern technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-xl w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}