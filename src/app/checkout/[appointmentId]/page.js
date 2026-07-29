'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('medicare_token');

    // Fetch Appointment Details & Create Payment Intent
    const fetchCheckoutData = async () => {
      try {
        const appRes = await axios.get(`${API_URL}/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointment(appRes.data);

        // Call Payment Intent API
        const intentRes = await axios.post(
          `${API_URL}/create-payment-intent`,
          { price: appRes.data.consultationFee || 50 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientSecret(intentRes.data.clientSecret);
      } catch (error) {
        console.error('Error initializing checkout:', error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) fetchCheckoutData();
  }, [appointmentId, API_URL]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Your Payment</h2>
        <p className="text-slate-600 text-sm mb-6">
          Please complete payment to confirm your appointment.
        </p>

        {/* Appointment Summary */}
        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Doctor:</span>
            <span className="font-semibold text-slate-800">{appointment?.doctorName || 'Dr. Specialist'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date & Time:</span>
            <span className="font-semibold text-slate-800">{appointment?.appointmentDate} at {appointment?.appointmentTime}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base">
            <span className="font-bold text-slate-800">Total Consultation Fee:</span>
            <span className="font-bold text-teal-600">${appointment?.consultationFee || 50}</span>
          </div>
        </div>

        {/* Stripe Elements Form */}
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm appointment={appointment} clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
}