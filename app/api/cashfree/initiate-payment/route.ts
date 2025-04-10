import { Cashfree, CFEnvironment } from "cashfree-pg";

export async function POST(req: Request) {
  const body = await req.json();
  const { orderId, orderAmount, customerId, customerPhone, customerEmail } = body;

  const cashfreeEnv =
    process.env.CASHFREE_ENV === "production"
      ? CFEnvironment.PRODUCTION
      : CFEnvironment.SANDBOX;

  const cashfree = new Cashfree({
    env: cashfreeEnv,
    appId: process.env.CASHFREE_APP_ID!,
    secretKey: process.env.CASHFREE_SECRET_KEY!,
  });

  try {
    const order = await cashfree.orders.create({
      orderId,
      orderAmount,
      orderCurrency: "INR",
      customerDetails: {
        customerId,
        customerPhone,
        customerEmail,
      },
      orderMeta: {
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status`,
        notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cashfree/webhook`,
      },
    });

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ error: "Error creating order" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
