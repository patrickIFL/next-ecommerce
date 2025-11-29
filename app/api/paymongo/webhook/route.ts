import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // console.log("✅ Webhook received:", JSON.stringify(body, null, 2));

    const eventType = body.data?.attributes?.type;
    console.log("🔔 Event type:", eventType);

//     x const session = body.data.attributes.data; // checkout_session object
// x const payment = session.attributes.payments[0]; // first payment
// x const payment_intent = session.attributes.payment_intent; 
// x const payment_intent_id = payment_intent.id; 

// x session.id = "cs_q4K8gkCdvxwJVhopxxrnZTLZ",
// x session.line_items = [
//              {
//                "amount": 49900,
//                "currency": "PHP",
//               "description": null,
//                "images": [],
//                "name": "Acer Chromebook 14",
//                "quantity": 1
//              },
//              {
//                "amount": 49900,
//                "currency": "PHP",
//                "description": null,
//                "images": [],
//                "name": "Acer Chromebook N19Q3",
//                "quantity": 1
//              }
//            ],

// x payment.id = "pay_sQECs2XnoZqWkp5J8uSNtWjd",

// VALUES YOU ENTERED DURING CHECKOUT SESSION
// x payment.attributes.billing.email = "patrickperez0530@gmail.com",
// x payment.attributes.billing.name = "Patrick Royce Perez",
// x payment.attributes.billing.phone = "09270523253"
// x payment.attributes.currency = "PHP"
// x payment.attributes.source.type = "gcash"

// x session.attributes.metadata


    // Match the correct PayMongo event
    if (eventType === "checkout_session.payment.paid") {
      const session = body.data.attributes.data; 
      const payment = session.attributes.payments[0];
      const payment_intent = session.attributes.payment_intent; 
      const payment_intent_id = payment_intent.id; 
      const payment_id = payment.id;
      const customer_name = payment.attributes.billing.name;
      const customer_email = payment.attributes.billing.email;
      const customer_phone = payment.attributes.billing.phone;
      const payment_method = payment.attributes.source.type;

      const metadata = session.attributes.metadata;
      const amount = payment.attributes.amount / 100;
      const status = payment.attributes.status;

      console.log("🎉 PAYMENT PAID EVENT");
      console.log("User:", metadata.userId);
      console.log("Customer Name:", customer_name);
      console.log("Customer Email:", customer_email);
      console.log("Customer Phone:", customer_phone);
      console.log("Payment Intent ID:", payment_intent_id);
      console.log("Payment ID:", payment_id);
      console.log("Raw Items:", metadata.items);

      // let items = [];
      // try {
      //   items = JSON.parse(metadata.items); // works if you store valid JSON
      // } catch (err) {
      //   console.log("⚠ Items are NOT JSON. Must fix metadata format.");
      // }

      // console.log("Parsed Items:", items);
      console.log("Amount:", amount);
      console.log("Payment Method:", payment_method);
      console.log("Status:", status);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("❌ Error in webhook handler:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}

