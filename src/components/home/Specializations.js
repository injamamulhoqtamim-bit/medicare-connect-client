'use client';
import { Heart, Brain, Bone, Baby, Sparkles, Activity } from 'lucide-react';

const specializations = [
  { name: 'Cardiology', icon: Heart, desc: 'Heart and vascular care', color: 'bg-red-100 text-red-600' },
  { name: 'Neurology', icon: Brain, desc: 'Brain and nervous system', color: 'bg-purple-100 text-purple-600' },
  { name: 'Orthopedics', icon: Bone, desc: 'Bone and joint health', color: 'bg-amber-100 text-amber-600' },
  { name: 'Pediatrics', icon: Baby, desc: 'Child health and development', color: 'bg-blue-100 text-blue-600' },
  { name: 'Dermatology', icon: Sparkles, desc: 'Skin and hair care', color: 'bg-pink-100 text-pink-600' },
  { name: 'General Medicine', icon: Activity, desc: 'Overall health & diagnosis', color: 'bg-teal-100 text-teal-600' },
];

export default function Specializations() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Medical Specializations</h2>
          <p className="text-slate-600 mt-2">Find specialists tailored to your health needs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specializations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition duration-300 text-center flex flex-col items-center group cursor-pointer"
              >
                <div className={`p-4 rounded-2xl mb-4 ${item.color} group-hover:scale-110 transition duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}