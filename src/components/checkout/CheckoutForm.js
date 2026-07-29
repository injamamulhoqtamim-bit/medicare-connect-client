'use client';
import { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle } from 'lucide-react';

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Payment Processed Successfully!');
    }, 1500);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-teal-600" /> Payment Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selector */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 font-semibold transition ${
              paymentMethod === 'card'
                ? 'border-teal-600 bg-teal-50 text-teal-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <CreditCard className="w-6 h-6" />
            <span>Card Payment</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('mfs')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 font-semibold transition ${
              paymentMethod === 'mfs'
                ? 'border-teal-600 bg-teal-50 text-teal-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
            <span>bKash / Nagad</span>
          </button>
        </div>

        {paymentMethod === 'card' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cardholder Name</label>
              <input type="text" required placeholder="John Doe" className="input input-bordered w-full" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Card Number</label>
              <input type="text" required placeholder="4242 •••• •••• 4242" className="input input-bordered w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label>
                <input type="text" required placeholder="MM/YY" className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CVC / CVV</label>
                <input type="text" required placeholder="123" className="input input-bordered w-full" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">MFS Mobile Number</label>
            <input type="text" required placeholder="017XXXXXXXX" className="input input-bordered w-full" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn bg-teal-600 hover:bg-teal-700 text-white border-none w-full flex items-center gap-2"
        >
          {loading ? <span className="loading loading-spinner"></span> : <><Lock className="w-4 h-4" /> Pay & Confirm Appointment</>}
        </button>
      </form>
    </div>
  );
}