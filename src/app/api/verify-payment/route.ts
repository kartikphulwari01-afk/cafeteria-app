import crypto from "crypto";
import { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Force-dynamic ensuring this route is never statically generated at build time
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error("Critical Error: RAZORPAY_KEY_SECRET missing in environment variables.");
      return Response.json(
        { success: false, message: "Payment verification configuration is missing." },
        { status: 500 }
      );
    }
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData // Full order details sent from frontend
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json(
        { success: false, message: "Missing required verification parameters." },
        { status: 400 }
      );
    }

    // Step 1: Create the verification string as per Razorpay docs
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Step 2: Generate the expected signature using the Key Secret
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    // Step 3: Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Step 4: Save order to Firestore (Server-side recording)
      // If orderData is provided, we save the full order. 
      // If not, we fall back to a minimal payment record.
      const finalOrderData = orderData ? {
        ...orderData,
        paymentStatus: "Paid",
        paymentMethod: "RAZORPAY",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        status: orderData.status || "pending",
        createdAt: serverTimestamp(),
      } : {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "paid",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), finalOrderData);

      return Response.json({ 
        success: true, 
        message: "Payment verified and order recorded successfully",
        orderId: docRef.id 
      });
    } else {
      return Response.json(
        { success: false, message: "Signature verification failed. Potential tampering detected." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return Response.json(
      { success: false, error: error.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
