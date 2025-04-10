import { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    const response = await fetch("/api/cashfree/initiate-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: "order_12345",
        orderAmount: 100,
        customerId: "cust_12345",
        customerPhone: "9876543210",
        customerEmail: "customer@example.com",
      }),
    });

    const data = await response.json();

    if (data.paymentSessionId) {
      // Load Cashfree checkout
      const cashfree = new window.Cashfree(data.paymentSessionId);
      cashfree.redirect();
    } else {
      console.error("Payment initiation failed");
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={initiatePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
