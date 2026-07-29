'use client';
import { Users, UserCheck, Calendar, Award } from 'lucide-react';

const stats = [
  { label: 'Total Patients Served', value: '10,000+', icon: Users },
  { label: 'Verified Doctors', value: '150+', icon: UserCheck },
  { label: 'Appointments Booked', value: '25,000+', icon: Calendar },
  { label: 'Patient Satisfaction', value: '99.5%', icon: Award },
];

export default function PlatformStats() {
  return (
    <section className="py-16 bg-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="inline-flex p-3 bg-teal-600/60 rounded-2xl mb-2">
                  <Icon className="w-8 h-8 text-teal-200" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold">{item.value}</h3>
                <p className="text-teal-100 text-sm">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}