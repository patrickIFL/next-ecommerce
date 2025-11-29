import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("✅ Webhook received:", JSON.stringify(body, null, 2));

    const eventType = body.data?.attributes?.type;
    console.log("🔔 Event type:", eventType);

    if (eventType === "payment.paid") {

      const paymentId = body.data.id;
      const paymentIntentId =
        body.data.attributes.data.attributes.payment_intent_id;
      const metadata = body.data.attributes.data.attributes.metadata;
      const totalAmount = body.data.attributes.data.attributes.amount / 100;
      const paymentStatus = body.data.attributes.data.attributes.status;

      const userId = metadata.userId;
      const products = JSON.parse(metadata.products);
      const couponCode = metadata.couponCode;

      // 🧪 Log everything first before processing
      console.log("🎉 PAYMENT PAID EVENT");
      console.log("User:", userId);
      console.log("Products:", products);
      console.log("Total Amount:", totalAmount);
      console.log("PayMongo Payment ID:", paymentId);
      console.log("PayMongo PaymentIntent ID:", paymentIntentId);
      console.log("Status:", paymentStatus);
      console.log("Coupon Code:", couponCode);

      // ⛔️ STOP HERE FOR NOW — you're testing logging only
      // Do NOT create orders yet

      return NextResponse.json(
        {
          success: true,
          message: "Webhook received and values logged",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in webhook handler:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
