import Razorpay from "razorpay";
import { NextRequest } from "next/server";

// Initialise Razorpay once at module level (server-only — env var is never exposed to browser)
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    // Validate: amount must be a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return Response.json(
        { error: "Invalid amount. Must be a positive number (in INR)." },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // paisa — round to avoid float issues
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return Response.json(order, { status: 200 });
  } catch (error: any) {
    // Surface Razorpay API errors clearly; hide internals from client
    const message =
      error?.error?.description ?? error?.message ?? "Failed to create order.";
    return Response.json({ error: message }, { status: 500 });
  }
}
