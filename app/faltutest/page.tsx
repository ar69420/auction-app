'use client';

import { useState } from 'react';

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);

    const response = await fetch('/api/cashfree/initiate-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: `test_order_${Date.now()}`, // unique order ID
        orderAmount: 99.99, // test amount
        customerId: 'test_user_123',
        customerPhone: '9999999999',
        customerEmail: 'testuser@example.com',
      }),
    });

    const data = await response.json();

    if (data.payment_session_id || data.paymentSessionId) {
      const sessionId = data.payment_session_id || data.paymentSessionId;

      // @ts-ignore
      const cashfree = new window.Cashfree(sessionId);
      cashfree.redirect(); // redirect to payment page
    } else {
      console.error('Payment initiation failed:', data);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧪 Test Cashfree Payment</h1>
      <p>Click below to test a dummy payment using sandbox mode.</p>

      <button
        onClick={initiatePayment}
        disabled={loading}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          background: '#0066ff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Redirecting...' : 'Pay ₹99.99'}
      </button>
    </div>
  );
}
