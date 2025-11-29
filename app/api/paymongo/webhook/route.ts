/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { inngest } from "@/src/config/inngest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const eventType = body.data?.attributes?.type;
    console.log("🔔 Event type:", eventType);

    if (eventType === "checkout_session.payment.paid") {

      // For Future Optimizations

      const session = body.data.attributes.data; 
      const payment = session.attributes.payments[0];
      // const payment_intent = session.attributes.payment_intent; 
      // const payment_intent_id = payment_intent.id; 
      // const payment_id = payment.id;
      // const customer_name = payment.attributes.billing.name;
      // const customer_email = payment.attributes.billing.email;
      // const customer_phone = payment.attributes.billing.phone;
      // const payment_method = payment.attributes.source.type;
      // const payment_date = payment.attributes.paid_at;

      const metadata = session.attributes.metadata;
      const amount = payment.attributes.amount / 100;
      // const status = payment.attributes.status;

      // console.log("🎉 PAYMENT PAID EVENT");
      // console.log("Paid at:", payment_date);
      // console.log("UserID:", metadata.userId);
      // console.log("Selected Address:", metadata.selectedAddressId);
      // console.log("Customer Name:", customer_name);
      // console.log("Customer Email:", customer_email);
      // console.log("Customer Phone:", customer_phone);
      // console.log("Payment Intent ID:", payment_intent_id);
      // console.log("Payment ID:", payment_id);
      // console.log("Raw Items:", metadata.cartItems);
      // console.log("Amount:", amount);
      // console.log("Payment Method:", payment_method);
      // console.log("Status:", status);

      const userId = metadata.userId;
      const selectedAddressId = metadata.selectedAddressId;
      const cartItems = JSON.parse(metadata.cartItems);
      
    // Prepare items for nested create
    const items = cartItems.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      }));
      
      await inngest.send({
      name: "order/created",
      data: {
        userId,
        shippingAddressId: selectedAddressId,
        amount,
        orderDate: new Date(),
        shippingMethod: "standard",
        items,
      },
    });

    // 5️⃣ Clear cart
    await prisma.cartItem.deleteMany({ where: { userId } });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("❌ Error in webhook handler:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}

