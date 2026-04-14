import Razorpay from "razorpay";
import { NextRequest } from "next/server";

// Force-dynamic ensuring this route is never statically generated at build time
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Safety check: ensure environment variables are present before initialization
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Critical Error: Razorpay keys missing in environment variables.");
      return Response.json(
        { error: "Payment gateway configuration is missing." },
        { status: 500 }
      );
    }

    // Initialize Razorpay inside the request handler to avoid build-time execution
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

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
    // Surface Razorpay API errors clearly; hide internals from client in logs if needed
    const message =
      error?.error?.description ?? error?.message ?? "Failed to create order.";
    console.error("Razorpay Order Error:", error);
    return Response.json({ error: message }, { status: 500 });
  }
}
