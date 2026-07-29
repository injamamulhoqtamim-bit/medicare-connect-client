'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { Star, Clock, DollarSign, MapPin, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';

export default function DoctorDetailsPage({ params: paramsPromise }) {
  // Next.js 15+ compatible params unwrapping
  const params = use(paramsPromise);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Sample Doctor Data (Later fetch dynamically using params.id)
  const doctor = {
    id: params?.id || '1',
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Cardiologist',
    specialization: 'Cardiology',
    experience: '12 Years',
    fee: 120,
    rating: 4.9,
    hospital: 'City Heart Hospital, NY',
    about: 'Dr. Sarah Jenkins is a renowned cardiologist with over 12 years of experience in diagnosing and treating cardiovascular diseases.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time slot.');
      return;
    }
    alert(`Appointment booked with ${doctor.name} for ${selectedDate} at ${selectedSlot}!`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Back Button */}
      <Link href="/doctors" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to All Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Doctor Info Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img src={doctor.image} alt={doctor.name} className="w-40 h-40 rounded-2xl object-cover" />
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
                {doctor.specialization}
              </span>
              <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
              <p className="text-slate-500 text-sm">{doctor.title}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-600 text-sm pt-2">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> {doctor.rating}
                </span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {doctor.experience} Exp</span>
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${doctor.fee} Fee</span>
              </div>

              <p className="flex items-center justify-center md:justify-start gap-1 text-slate-500 text-xs mt-2">
                <MapPin className="w-4 h-4 text-teal-600" /> {doctor.hospital}
              </p>
            </div>
          </div>

          {/* About Doctor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">About Doctor</h2>
            <p className="text-slate-600 leading-relaxed text-sm">{doctor.about}</p>
          </div>
        </div>

        {/* Appointment Booking Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" /> Book Appointment
          </h2>

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Date</label>
              <input 
                type="date" 
                required 
                className="input input-bordered w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Available Time Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {doctor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 text-xs font-semibold rounded-xl border transition ${
                      selectedSlot === slot 
                        ? 'bg-teal-600 text-white border-teal-600' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-500'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none w-full flex items-center gap-2 mt-6"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Booking
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}