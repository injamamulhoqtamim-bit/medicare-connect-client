'use client';
import Link from 'next/link';
import { HeartPulse, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
              <HeartPulse className="h-8 w-8 text-rose-500" />
              <span>MediCare<span className="text-teal-400">Connect</span></span>
            </Link>
            <p className="text-sm text-slate-400">
              Connecting patients with world-class healthcare professionals instantly and securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-teal-400 transition">Home</Link></li>
              <li><Link href="/doctors" className="hover:text-teal-400 transition">Find Doctors</Link></li>
              <li><Link href="/about" className="hover:text-teal-400 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>123 Healthcare Ave, Medical City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+1 (555) 000-1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@medicareconnect.com</span>
              </li>
            </ul>
          </div>

          {/* Emergency Hotline */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Emergency Hotline</h3>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-semibold">24/7 Toll-Free Line</p>
              <p className="text-xl font-bold text-rose-500 mt-1">10616 / 999</p>
              <p className="text-xs text-slate-400 mt-1">Immediate ambulance and medical support.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MediCare Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}