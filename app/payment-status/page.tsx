'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderStatus = searchParams.get('orderStatus');
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    if (orderStatus) {
      setStatus(orderStatus === 'PAID' ? 'Payment Successful!' : 'Payment Failed');
    }
  }, [orderStatus]);

  return (
    <div>
      <h1>Payment Status</h1>
      <p>Order ID: {orderId}</p>
      <p>Status: {status}</p>
    </div>
  );
}
