/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { cache } from "react";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/common/BackButton";
import {
  Hourglass,
  MapPin,
  NotepadText,
  Package2,
  PackageCheck,
  PackageOpen,
  PhilippinePeso,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { formatMoney } from "@/lib/utils";
// import { OrderItem } from "@/lib/types";
const currency = process.env.NEXT_PUBLIC_CURRENCY;

const getOrderById = cache(async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      orderDate: true,
      shippingMethod: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },

      shippingAddress: {
        select: {
          fullName: true,
          phoneNumber: true,
          area: true,
          city: true,
          province: true,
          zipcode: true,
        },
      },

      payment: {
        select: {
          method: true,
          date: true,
          amount: true,
          tax: true,
          shipping: true,
        },
      },

      items: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              name: true,
              image: true,
              price: true,
              salePrice: true,
            },
          },
          variant: {
            select: {
              name: true,
              price: true,
              salePrice: true,
              imageIndex: true,
            },
          },
        },
      },
    },
  });
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    return {
      title: "Order Not Found - NextCart",
      description: "",
    };
  }

  return {
    title: `${order?.id} - NextCart`,
    description: "",
  };
}

export default async function IndividualOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      {/* ==================== HEADER START ==================== */}
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <div className="flex flex-col mb-2">
          <p className="text-2xl font-medium">{`Order# ${order?.id ?? ""}`}</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      </div>
      {/* ==================== HEADER END ==================== */}
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex flex-col flex-2 gap-3">
          {/* ==================== ORDER STATUS START ==================== */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex flex-col font-medium">
                <span className="text-lg font-semibold">Status</span>
                <span className="text-xs text-foreground/80 font-normal">
                  Current Order Status
                </span>
              </CardTitle>
              <div></div>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Status Contents Start */}
              <div className="flex gap-2 bg-accent/30 border p-2 rounded-lg">
                {/* status card */}
                <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                  <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center  ">
                    <NotepadText className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <span className="font-semibold">Order Confirmed</span>

                  <div className="h-1.5 bg-primary rounded-full" />
                </div>
                {/* status card */}
                <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                  <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center  ">
                    <PackageOpen className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <span className="font-semibold">Preparing</span>

                  <div className="h-1.5 bg-primary rounded-full" />
                </div>
                {/* status card */}
                <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                  <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center  ">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <span className="font-semibold">Shipped</span>

                  <div className="h-1.5 bg-primary rounded-full" />
                </div>
                {/* status card */}
                <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                  <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center  ">
                    <PackageCheck className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <span className="font-semibold">Received</span>

                  <div className="h-1.5 bg-primary rounded-full" />
                </div>

                {/* Status Contents End */}
              </div>
            </CardContent>
          </Card>
          {/* ==================== ORDER STATUS END ==================== */}

          {/* ==================== PRODUCTS START ==================== */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex flex-col font-medium">
                <span className="text-lg font-semibold">Product</span>
                <span className="text-xs text-foreground/80 font-normal">
                  Your shipment
                </span>
              </CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-accent/40">
                    <tr className="border-b">
                      <th className="p-3 text-left">Image</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order?.items.map((item: any) => {
                      const imageIndex = item.variant?.imageIndex ?? 0;

                      const unitPrice =
                        item.variant?.salePrice ??
                        item.variant?.price ??
                        item.product?.salePrice ??
                        item.product?.price ??
                        0;

                      const amount = unitPrice * item.quantity;

                      return (
                        <tr key={item.id} className="border-b last:border-0">
                          {/* IMAGE */}
                          <td className="p-3">
                            <Image
                              src={
                                item.product?.image?.[imageIndex] ??
                                "/placeholder.png"
                              }
                              alt={item.product?.name}
                              width={48}
                              height={48}
                              className="rounded-md border"
                            />
                          </td>

                          {/* NAME */}
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.product?.name}
                              </span>
                              {item.variant?.name && (
                                <span className="text-xs text-muted-foreground">
                                  {item.variant.name}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="p-3 text-center">
                            <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
                              Ready
                            </span>
                          </td>

                          {/* QUANTITY */}
                          <td className="p-3 text-center font-medium">
                            {item.quantity}
                          </td>

                          {/* PRICE */}
                          <td className="p-3 text-right">
                            {currency}
                            {formatMoney(unitPrice)}
                          </td>

                          {/* AMOUNT */}
                          <td className="p-3 text-right font-semibold">
                            {currency}
                            {formatMoney(amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* ==================== PRODUCTS END ==================== */}

          {/* ==================== PROGRESS TRACKING START ==================== */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex flex-col font-medium">
                <span className="text-lg font-semibold">Progress</span>
                <span className="text-xs text-foreground/80 font-normal">
                  Track Shipping Progress
                </span>
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Status Contents Start */}
              <div className="flex flex-col gap-2 bg-accent/30 border p-2 rounded-lg">
                {/* status card */}
                <div className="flex flex-1 flex-row items-center gap-3 font-medium bg-card p-3 rounded-lg border">
                  <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center  ">
                    <NotepadText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="font-semibold">Order Confirmed</span>
                    <span className="font-normal text-xs text-foreground/50">
                      Order Confirmed
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="font-normal text-xs text-foreground">
                      Jan 15, 2026
                    </span>
                    <span className="font-normal text-xs text-foreground">
                      06:34 AM
                    </span>
                  </div>

                  <div className="h-1.5 bg-primary rounded-full" />
                </div>

                {/* Status Contents End */}
              </div>
            </CardContent>
          </Card>
          {/* ==================== PROGRESS TRACKING END ==================== */}
        </div>

        <div className="flex flex-col flex-1 gap-3">
          {/* ==================== PAYMENT START ==================== */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex flex-col font-medium">
                <span className="text-lg font-semibold">Payment</span>
                <span className="text-xs text-foreground/80 font-normal">
                  Final Payment Amount
                </span>
              </CardTitle>
              <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="border rounded-md bg-accent/30 p-3">
                <table className="table-auto w-full border-separate border-spacing-y-2">
                  <tbody className="text-sm">
                    {/* METHOD */}
                    <tr>
                      <td className="text-foreground font-medium">Method:</td>
                      <td className="text-right text-foreground">
                        {String(order?.payment?.method ?? "—").toUpperCase()}
                      </td>
                    </tr>

                    {/* DATE */}
                    <tr>
                      <td className="text-foreground font-medium">Date:</td>
                      <td className="text-right text-foreground">
                        {order?.payment?.date
                          ? new Date(order?.payment.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              },
                            )
                          : "—"}
                      </td>
                    </tr>

                    {/* TIME */}
                    <tr>
                      <td className="text-foreground font-medium">Time:</td>
                      <td className="text-right text-foreground">
                        {order?.payment?.date
                          ? new Date(order?.payment.date).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "—"}
                      </td>
                    </tr>

                    {/* SUBTOTAL */}
                    <tr className="pt-2">
                      <td className="text-foreground font-medium">Subtotal:</td>
                      <td className="text-right text-foreground">
                        {currency}
                        {formatMoney(
                          Math.max(
                            (order?.payment?.amount ?? 0) -
                              (order?.payment?.tax ?? 0) -
                              (order?.payment?.shipping ?? 0),
                            0,
                          ),
                        )}
                      </td>
                    </tr>

                    {/* TAX */}
                    <tr>
                      <td className="text-foreground font-medium">Tax:</td>
                      <td className="text-right text-foreground">
                        {currency}
                        {formatMoney(order?.payment?.tax ?? 0)}
                      </td>
                    </tr>

                    {/* SHIPPING */}
                    <tr>
                      <td className="text-foreground font-medium">Shipping:</td>
                      <td className="text-right text-foreground">
                        {currency}
                        {formatMoney(order?.payment?.shipping ?? 0)}
                      </td>
                    </tr>

                    {/* DIVIDER */}
                    <tr>
                      <td colSpan={2}>
                        <div className="my-2 border-t border-dashed border-muted-foreground/30" />
                      </td>
                    </tr>

                    {/* TOTAL */}
                    <tr>
                      <td className="text-foreground font-semibold">Total:</td>
                      <td className="text-right font-semibold">
                        {currency}
                        {formatMoney(order?.payment?.amount ?? 0)}
                      </td>
                    </tr>

                    {/* PAYMENT STATUS */}
                    <tr>
                      <td className="text-foreground font-medium">Payment:</td>
                      <td className="text-right">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            order?.payment
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {order?.payment ? "PAID" : "UNPAID"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* ==================== PAYMENT END ==================== */}

          {/* ==================== CUSTOMER INFO START ==================== */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex flex-col font-medium">
                <span className="text-lg font-semibold">Customer</span>
                <span className="text-xs text-foreground/80 font-normal">
                  Customer Information
                </span>
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="border rounded-md bg-accent/30 p-3">
                <table className="table-auto w-full border-separate border-spacing-y-2">
                  <tbody className="text-sm">
                    {/* GENERAL INFO TITLE */}
                    <tr>
                      <td colSpan={2} className="pt-2 pb-1">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="underline underline-offset-2">
                            General Info
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* CUSTOMER NAME */}
                    <tr>
                      <td className="text-foreground font-medium">Name:</td>
                      <td className="text-right text-foreground">
                        {order.user?.name ?? "—"}
                      </td>
                    </tr>

                    {/* EMAIL */}
                    <tr>
                      <td className="text-foreground font-medium">Email:</td>
                      <td className="text-right text-foreground">
                        {order.user?.email ?? "—"}
                      </td>
                    </tr>

                    {/* PHONE */}
                    <tr>
                      <td className="text-foreground font-medium">Phone:</td>
                      <td className="text-right text-foreground">
                        {order.shippingAddress?.phoneNumber ?? "—"}
                      </td>
                    </tr>

                    {/* DIVIDER */}
                    <tr>
                      <td colSpan={2}>
                        <div className="my-2 border-t border-dashed border-muted-foreground/30" />
                      </td>
                    </tr>

                    {/* SHIPPING INFO TITLE */}
                    <tr>
                      <td colSpan={2} className="pt-2 pb-1">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="underline underline-offset-2">
                            Shipping Info
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* RECIPIENT */}
                    <tr>
                      <td className="text-foreground font-medium">
                        Recipient:
                      </td>
                      <td className="text-right text-foreground">
                        {order.shippingAddress?.fullName ?? "—"}
                      </td>
                    </tr>

                    {/* ADDRESS */}
                    <tr>
                      <td className="text-foreground font-medium">Address:</td>
                      <td className="text-right text-foreground leading-snug">
                        {order.shippingAddress ? (
                          <>
                            {order.shippingAddress.area},<br />
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.province}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>

                    {/* ZIPCODE */}
                    <tr>
                      <td className="text-foreground font-medium">Zip Code:</td>
                      <td className="text-right text-foreground">
                        {order.shippingAddress?.zipcode ?? "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ==================== CUSTOMER INFO START ==================== */}
        </div>
      </div>
    </div>
  );
}
