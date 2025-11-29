import { NextRequest, NextResponse } from "next/server";

// 2025-11-29 05:56:23.825 [info] ✅ Webhook received: {
//   "data": {
//     "id": "evt_AK2rkYasuWx5jx12krp2nZ3n",
//     "type": "event",
//     "attributes": {
//       "type": "checkout_session.payment.paid",
//       "livemode": false,
//       "data": {
//         "id": "cs_q4K8gkCdvxwJVhopxxrnZTLZ",
//         "type": "checkout_session",
//         "attributes": {
//           "billing": {
//             "address": {
//               "city": null,
//               "country": null,
//               "line1": null,
//               "line2": null,
//               "postal_code": null,
//               "state": null
//             },
//             "email": null,
//             "name": null,
//             "phone": null
//           },
//           "billing_information_fields_editable": "enabled",
//           "cancel_url": "https://next-ecommerce-silk-rho.vercel.app//cart",
//           "checkout_url": "https://checkout.paymongo.com/cs_q4K8gkCdvxwJVhopxxrnZTLZ_client_eDmuxRpxuzQzbsSUZz15xBNv#cGtfdGVzdF9wTXM4Wm9qcnhIc3UzUDdLdXVHbm9lUjI=",
//           "client_key": "cs_q4K8gkCdvxwJVhopxxrnZTLZ_client_eDmuxRpxuzQzbsSUZz15xBNv",
//           "customer_email": null,
//           "description": "Next-Ecommerce",
//           "line_items": [
//             {
//               "amount": 49900,
//               "currency": "PHP",
//               "description": null,
//               "images": [],
//               "name": "Acer Chromebook 14",
//               "quantity": 1
//             },
//             {
//               "amount": 49900,
//               "currency": "PHP",
//               "description": null,
//               "images": [],
//               "name": "Acer Chromebook N19Q3",
//               "quantity": 1
//             }
//           ],
//           "livemode": false,
//           "merchant": "Patrick Royce Perez",
//           "paid_at": 1764395782,
//           "payments": [
//             {
//               "id": "pay_sQECs2XnoZqWkp5J8uSNtWjd",
//               "type": "payment",
//               "attributes": {
//                 "access_url": null,
//                 "amount": 99800,
//                 "balance_transaction_id": "bal_txn_peY1wxzRi1r1NPCHSAKZxEKE",
//                 "billing": {
//                   "address": {
//                     "city": "",
//                     "country": "",
//                     "line1": "",
//                     "line2": "",
//                     "postal_code": "",
//                     "state": ""
//                   },
//                   "email": "patrickperez0530@gmail.com",
//                   "name": "Patrick Royce Perez",
//                   "phone": "09270523253"
//                 },
//                 "currency": "PHP",
//                 "description": "Next-Ecommerce",
//                 "digital_withholding_vat_amount": 0,
//                 "disputed": false,
//                 "external_reference_number": null,
//                 "fee": 2495,
//                 "instant_settlement": null,
//                 "livemode": false,
//                 "net_amount": 97305,
//                 "origin": "api",
//                 "payment_intent_id": "pi_rZSiY7hxap1mmkcYUqznADm6",
//                 "payout": null,
//                 "source": {
//                   "id": "src_ewtU7u2fP5AR3i7PkjzuF1Ui",
//                   "type": "gcash",
//                   "provider": {
//                     "id": null
//                   },
//                   "provider_id": null
//                 },
//                 "statement_descriptor": "Patrick Royce Perez",
//                 "status": "paid",
//                 "tax_amount": null,
//                 "metadata": {
//                   "userId": "user_362PwHw86v7UwmMvym3l7XP6x9H",
//                   "items": "[{:id=>\"cmiglhhuv0009ubzkv8qw3c8h\", :qty=>1}, {:id=>\"cmiglfyox0005ubzkd4gs490s\", :qty=>1}]"
//                 },
//                 "promotion": null,
//                 "refunds": [],
//                 "taxes": [],
//                 "available_at": 1764752400,
//                 "created_at": 1764395783,
//                 "credited_at": 1765328400,
//                 "paid_at": 1764395782,
//                 "updated_at": 1764395783
//               }
//             }
//           ],
//           "payment_intent": {
//             "id": "pi_rZSiY7hxap1mmkcYUqznADm6",
//             "type": "payment_intent",
//             "attributes": {
//               "amount": 99800,
//               "capture_type": "automatic",
//               "client_key": "pi_rZSiY7hxap1mmkcYUqznADm6_client_qPLLaEutjLmdeA3rZCxhCAgK",
//               "currency": "PHP",
//               "description": "Next-Ecommerce",
//               "livemode": false,
//               "original_amount": 99800,
//               "statement_descriptor": "Patrick Royce Perez",
//               "status": "succeeded",
//               "last_payment_error": null,
//               "payment_method_allowed": [
//                 "gcash",
//                 "card"
//               ],
//               "payments": [
//                 {
//                   "id": "pay_sQECs2XnoZqWkp5J8uSNtWjd",
//                   "type": "payment",
//                   "attributes": {
//                     "access_url": null,
//                     "amount": 99800,
//                     "balance_transaction_id": "bal_txn_peY1wxzRi1r1NPCHSAKZxEKE",
//                     "billing": {
//                       "address": {
//                         "city": "",
//                         "country": "",
//                         "line1": "",
//                         "line2": "",
//                         "postal_code": "",
//                         "state": ""
//                       },
//                       "email": "patrickperez0530@gmail.com",
//                       "name": "Patrick Royce Perez",
//                       "phone": "09270523253"
//                     },
//                     "currency": "PHP",
//                     "description": "Next-Ecommerce",
//                     "digital_withholding_vat_amount": 0,
//                     "disputed": false,
//                     "external_reference_number": null,
//                     "fee": 2495,
//                     "instant_settlement": null,
//                     "livemode": false,
//                     "net_amount": 97305,
//                     "origin": "api",
//                     "payment_intent_id": "pi_rZSiY7hxap1mmkcYUqznADm6",
//                     "payout": null,
//                     "source": {
//                       "id": "src_ewtU7u2fP5AR3i7PkjzuF1Ui",
//                       "type": "gcash",
//                       "provider": {
//                         "id": null
//                       },
//                       "provider_id": null
//                     },
//                     "statement_descriptor": "Patrick Royce Perez",
//                     "status": "paid",
//                     "tax_amount": null,
//                     "metadata": {
//                       "userId": "user_362PwHw86v7UwmMvym3l7XP6x9H",
//                       "items": "[{:id=>\"cmiglhhuv0009ubzkv8qw3c8h\", :qty=>1}, {:id=>\"cmiglfyox0005ubzkd4gs490s\", :qty=>1}]"
//                     },
//                     "promotion": null,
//                     "refunds": [],
//                     "taxes": [],
//                     "available_at": 1764752400,
//                     "created_at": 1764395783,
//                     "credited_at": 1765328400,
//                     "paid_at": 1764395782,
//                     "updated_at": 1764395783
//                   }
//                 }
//               ],
//               "next_action": null,
//               "payment_method_options": {
//                 "card": {
//                   "request_three_d_secure": "any"
//                 }
//               },
//               "metadata": {
//                 "userId": "user_362PwHw86v7UwmMvym3l7XP6x9H",
//                 "items": "[{:id=>\"cmiglhhuv0009ubzkv8qw3c8h\", :qty=>1}, {:id=>\"cmiglfyox0005ubzkd4gs490s\", :qty=>1}]"
//               },
//               "setup_future_usage": null,
//               "created_at": 1764395771,
//               "updated_at": 1764395783
//             }
//           },
//           "payment_method_types": [
//             "card",
//             "gcash"
//           ],
//           "payment_method_used": "gcash",
//           "reference_number": null,
//           "send_email_receipt": false,
//           "show_description": true,
//           "show_line_items": true,
//           "status": "active",
//           "success_url": "https://next-ecommerce-silk-rho.vercel.app//order-placed",
//           "created_at": 1764395771,
//           "updated_at": 1764395771,
//           "metadata": {
//             "items": "[{:id=>\"cmiglhhuv0009ubzkv8qw3c8h\", :qty=>1}, {:id=>\"cmiglfyox0005ubzkd4gs490s\", :qty=>1}]",
//             "userId": "user_362PwHw86v7UwmMvym3l7XP6x9H"
//           }
//         }
//       },
//       "previous_data": {},
//       "pending_webhooks": 1,
//       "created_at": 1764395783,
//       "updated_at": 1764395783
//     }
//   }
// }
// 2025-11-29 05:56:23.825 [info] 🔔 Event type: checkout_session.payment.paid

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // console.log("✅ Webhook received:", JSON.stringify(body, null, 2));

    const eventType = body.data?.attributes?.type;
    console.log("🔔 Event type:", eventType);

    // Match the correct PayMongo event
    if (eventType === "payment.paid") {
      const session = body.data.attributes.data; // checkout_session object
      const payment = session.attributes.payments[0]; // first payment

      const metadata = payment.attributes.metadata;
      const amount = payment.attributes.amount / 100;
      const status = payment.attributes.status;

      console.log("🎉 PAYMENT PAID EVENT");
      console.log("User:", metadata.userId);
      console.log("Raw Items:", metadata.items);

      let items = [];
      try {
        items = JSON.parse(metadata.items); // works if you store valid JSON
      } catch (err) {
        console.log("⚠ Items are NOT JSON. Must fix metadata format.");
      }

      console.log("Parsed Items:", items);
      console.log("Amount:", amount);
      console.log("Status:", status);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("❌ Error in webhook handler:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}

