'use client';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will contact you soon.');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Get in Touch</h1>
        <p className="text-slate-600 mt-2">
          Have questions or need assistance? Our team is here to help you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Our Location</h3>
              <p className="text-sm text-slate-600 mt-1">
                123 Healthcare Ave, Medical City, NY 10001
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Phone Number</h3>
              <p className="text-sm text-slate-600 mt-1">+1 (555) 000-1234</p>
              <p className="text-xs text-rose-500 font-semibold mt-1">Emergency: 10616 / 999</p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Email Address</h3>
              <p className="text-sm text-slate-600 mt-1">support@medicareconnect.com</p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Working Hours</h3>
              <p className="text-sm text-slate-600 mt-1">Mon - Sun: 24/7 Available</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Appointment Inquiry / Support"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                rows="5"
                required
                placeholder="Type your message here..."
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none w-full flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}