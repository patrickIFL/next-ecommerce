"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, PackageOpen } from "lucide-react";

import { formatMoney } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState";
import Box_icon from "@/components/svgs/Box_icon";
import { ProductCircles } from "@/components/ui/avatar-circles";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import SellerPageTitle from "@/components/seller/SellerPageTitle";

const Orders: React.FC = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  const {
    data: allOrders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      const res = await fetch("/api/order/seller-orders");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders");
      }
      return data.orders;
    },
  });

  if (isLoading) return null;

  if (isError) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="Unable to load orders"
        description="Please try again later."
      />
    );
  }
  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <SellerPageTitle title="All Orders" />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-accent text-foreground">
              <th className="p-3">Order</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3">Shipping Address</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3">Info</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={PackageOpen}
                    title="No orders yet"
                    description="Orders will appear here once customers place them."
                  />
                </td>
              </tr>
            ) : (
              allOrders.map((order: any) => {
                const isOpen = openOrder === order.id;
                const firstItem = order.items?.[0];

                const productUrls = order.items.map((item: any) => {
                  const imageIndex = item.variant?.imageIndex ?? 0;
                  return {
                    imageUrl:
                      item.product?.image?.[imageIndex] ?? "/placeholder.png",
                    productUrl: `/product/${item.product?.id}`,
                  };
                });

                return (
                  <React.Fragment key={order.id}>
                    {/* ================= PARENT ROW ================= */}
                    <tr className="border-b align-top">
                      {/* ORDER */}
                      <td className="p-3">
                        <div className="flex gap-3">
                          <Tooltip>
                            <TooltipTrigger>
                              <Box_icon isOpen={isOpen} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Order</p>
                            </TooltipContent>
                          </Tooltip>

                          <div className="flex flex-col gap-1">
                            {!isOpen ? (
                              <div className="flex justify-between min-w-[250px]">
                                <span>{firstItem?.product?.name}</span>
                                <span className="text-foreground/50">
                                  × {firstItem?.quantity}
                                </span>
                              </div>
                            ) : (
                              <>
                                <span>Order Reference</span>
                                <span className="text-xs text-foreground/50">
                                  #{order.id}
                                </span>
                              </>
                            )}

                            <ProductCircles
                              numProducts={Math.max(order.items.length - 5, 0)}
                              productUrls={productUrls}
                              className="scale-75 origin-left"
                              toggleList={() =>
                                setOpenOrder(isOpen ? null : order.id)
                              }
                            />
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 text-xs border border-amber-300 text-amber-500 rounded bg-amber-300/20">
                          PREPARING
                        </span>
                      </td>

                      {/* SHIPPING */}
                      <td className="p-3">
                        <p>
                          <strong>{order.shippingAddress?.fullName}</strong>
                          <br />
                          {order.shippingAddress?.area}
                          <br />
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.province}
                          <br />
                          {order.shippingAddress?.phoneNumber}
                        </p>
                      </td>

                      {/* TOTAL */}
                      <td className="p-3 text-center">
                        {currency}
                        {formatMoney(order.amount)}
                      </td>

                      {/* INFO */}
                      <td className="p-3">
                        <table className="text-sm">
                          <tbody>
                            <tr>
                              <td className="font-medium">Method:</td>
                              <td>{order.payment?.method?.toUpperCase()}</td>
                            </tr>
                            <tr>
                              <td className="font-medium">Date:</td>
                              <td>
                                {new Date(order.orderDate).toLocaleDateString()}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-medium">Time:</td>
                              <td>
                                {new Date(order.orderDate).toLocaleTimeString(
                                  undefined,
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-medium">Payment:</td>
                              <td>{order.payment ? "PAID" : "UNPAID"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      {/* TOGGLE */}
                      <td className="p-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setOpenOrder(isOpen ? null : order.id)}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </td>
                    </tr>

                    {/* ================= ACCORDION ================= */}
                    {isOpen && (
                      <tr className="bg-accent/20">
                        <td colSpan={6} className="px-4 pt-2">
                          <div className="border rounded-md bg-accent/40">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="p-3 text-left">Item</th>
                                  <th className="p-3 text-center">
                                    Unit Price
                                  </th>
                                  <th className="p-3 text-center">Total</th>
                                  <th className="p-3 text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item: any) => {
                                  const imageIndex =
                                    item.variant?.imageIndex ?? 0;
                                  const unitPrice =
                                    item.variant?.salePrice ??
                                    item.variant?.price ??
                                    item.product?.salePrice ??
                                    item.product?.price ??
                                    0;

                                  return (
                                    <tr key={item.id} className="border-b">
                                      <td className="p-3">
                                        <div className="flex gap-4 items-center">
                                          <Image
                                            src={
                                              item.product?.image?.[
                                                imageIndex
                                              ] ?? "/placeholder.png"
                                            }
                                            alt={item.product?.name}
                                            width={64}
                                            height={64}
                                          />
                                          <div>
                                            <p>{item.product?.name}</p>
                                            <p className="text-xs text-muted">
                                              × {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3 text-center">
                                        {currency}
                                        {formatMoney(unitPrice)}
                                      </td>
                                      <td className="p-3 text-center font-medium">
                                        {currency}
                                        {formatMoney(unitPrice * item.quantity)}
                                      </td>
                                      <td className="p-3 text-center">
                                        <Button size="sm">Buy Again</Button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="my-5 border-t-2 border-dashed border-primary" />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
