'use client';
import { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function CheckoutForm({ appointment, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [cardError, setCardError] = useState('');
  const [processing, setProcessing] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setProcessing(true);
    setCardError('');

    // Confirm Payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.name || 'Anonymous Patient',
            email: user?.email || 'patient@example.com',
          },
        },
      }
    );

    if (confirmError) {
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      const token = localStorage.getItem('medicare_token');

      // Payment details to store in database
      const paymentInfo = {
        appointmentId: appointment?._id,
        patientEmail: user?.email,
        doctorId: appointment?.doctorId,
        amount: appointment?.consultationFee || 50,
        transactionId: paymentIntent.id,
        paymentDate: new Date(),
      };

      try {
        await axios.post(`${API_URL}/payments`, paymentInfo, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful! 🎉',
          text: `Transaction ID: ${paymentIntent.id}`,
          confirmButtonColor: '#0d9488',
        });

        router.push('/dashboard/patient/my-appointments');
      } catch (err) {
        console.error('Failed to save payment:', err);
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-xl bg-slate-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1e293b',
                '::placeholder': { color: '#94a3b8' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
        />
      </div>

      {cardError && <p className="text-red-500 text-sm">{cardError}</p>}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="btn bg-teal-600 hover:bg-teal-700 text-white w-full border-none py-3 rounded-xl font-semibold text-lg"
      >
        {processing ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
}