"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, PackageOpen } from "lucide-react";

import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import Box_icon from "@/components/svgs/Box_icon";
import { ProductCircles } from "@/components/ui/avatar-circles";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useOrderHook from "@/hooks/useOrderHook";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCartHook from "@/hooks/useCartHook";

const MyOrders: React.FC = () => {
  const router = useRouter();
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const { handleBuyNow } = useCartHook();

  const {
    myOrders: orders,
    myOrdersLoading: loading,
    refetchMyOrders,
    isRefetchingMyOrders: refetching,
  } = useOrderHook();

  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  useEffect(() => {
    refetchMyOrders();
  }, [refetchMyOrders]);

  if (loading || refetching) {
    return <Loading />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 py-6 min-h-screen mt-16">
      <h2 className="text-lg font-medium mb-6">My Orders</h2>

      <div className="min-w-full mx-auto overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-accent bg-accent text-foreground">
              <th className="p-3">Order</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3">Shipping Address</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3">Info</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={PackageOpen}
                    title="No orders yet"
                    description="Your orders will appear here once you’ve made a purchase."
                    actionText="Continue Shopping"
                    onAction={() => router.push("/")}
                  />
                </td>
              </tr>
            ) : (
              orders.map((order: any) => {
                const isOpen = openOrder === order.id;

                /* ================= PRODUCT CIRCLES ================= */
                const productUrls = order.items.slice(0, 5).map((item: any) => {
                  const product = item.product;
                  const variant = item.variant ?? null;
                  const imageIndex = variant?.imageIndex ?? 0;

                  return {
                    imageUrl:
                      product?.image?.[imageIndex] ?? "/placeholder.png",
                    productUrl: `/product/${product?.id}`,
                  };
                });

                const firstItem = order.items[0];
                const firstProduct = firstItem?.product;
                const firstVariant = firstItem?.variant ?? null;

                return (
                  <React.Fragment key={order.id}>
                    {/* ================= PARENT ROW ================= */}
                    <tr className="border-b border-accent align-top">
                      {/* ORDER */}
                      <td className="p-3">
                        <div className="flex gap-3">
                          <Tooltip>
                            <TooltipTrigger>
                              <Box_icon isOpen={isOpen} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Order Details</p>
                            </TooltipContent>
                          </Tooltip>

                          <div className="flex flex-col gap-1">
                            <div className="text-sm flex flex-col">
                              <div className="min-w-[250px] flex justify-between">
                                {isOpen ? (
                                  <>
                                    <span className="text-foreground">
                                      Order Reference ID
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-foreground max-w-[200px] truncate">
                                      {firstProduct?.name}
                                    </span>

                                    <span className="text-foreground/50">
                                      × {firstItem.quantity}
                                    </span>
                                  </>
                                )}
                              </div>

                              {isOpen && (
                                <span className="text-xs text-foreground/50">
                                  #{order.id}
                                </span>
                              )}

                              {firstVariant && !isOpen && (
                                <p className="text-xs text-foreground/50">
                                  {firstVariant.name.split(" - ")[0].trim()}{" "}
                                </p>
                              )}
                            </div>
                            {/* MAX CIRCLES = 5, to change, numProducts, map slice */}
                            <ProductCircles
                              numProducts={Math.max(order.items.length - 5, 0)}
                              className="scale-75 origin-left"
                              productUrls={productUrls}
                              toggleList={() =>
                                setOpenOrder(isOpen ? null : order.id)
                              }
                            />
                          </div>
                        </div>
                      </td>

                      {/* SHIPPING STATUS */}
                      <td className="p-3">
                        <div className="px-0.5 py-0.5 border-amber-300 text-amber-500 border text-center rounded-md bg-amber-300/20">
                          PREPARING
                        </div>
                      </td>
                      {/* SHIPPING */}
                      <td className="p-3">
                        <p>
                          <span className="font-medium">
                            {order.shippingAddress?.fullName}
                          </span>
                          <br />
                          {order.shippingAddress?.area}
                          <br />
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.province}
                          <br />
                          {order.shippingAddress?.phoneNumber}
                        </p>
                      </td>

                      {/* AMOUNT */}
                      <td className="p-3 font-normal text-center min-w-[150px]">
                        {currency}
                        {formatMoney(order.amount)}
                      </td>

                      {/* INFO */}
                      <td className="p-3">
                        <table className="table-auto border-collapse w-full max-w-72">
                          <tbody className="text-sm">
                            <tr>
                              <td className="text-foreground font-medium">
                                Method:
                              </td>
                              <td className="text-foreground">
                                {String(order.payment?.method).toUpperCase()}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-foreground font-medium">
                                Date:
                              </td>
                              <td className="text-foreground">
                                {new Date(order.orderDate).toLocaleString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                  }
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="foreground font-medium">Time:</td>
                              <td className="text-foreground">
                                {new Date(order.orderDate).toLocaleString(
                                  undefined,
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="foreground font-medium">
                                Payment:
                              </td>
                              <td className="text-foreground">
                                {order.payment ? "PAID" : "UNPAID"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      {/* CHEVRON */}
                      <td className="p-3 text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() =>
                                setOpenOrder(isOpen ? null : order.id)
                              }
                            >
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>See products</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    </tr>

                    {/* ================= ACCORDION CONTENT ================= */}
                    {isOpen && (
                      <tr className="bg-accent/20">
                        <td colSpan={6} className="pt-2 px-4">
                          <div className="rounded-md border bg-accent/40">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="py-3 px-4 text-left">
                                    Order Items
                                  </th>
                                  <th className="py-3 px-4 text-center">
                                    Unit Price
                                  </th>
                                  <th className="py-3 px-4 text-center">
                                    Amount
                                  </th>
                                  <th className="py-3 px-4 text-center">
                                    Actions
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {order.items.map((item: any) => {
                                  const product = item.product;
                                  const variant = item.variant ?? null;

                                  const isOutOfStock = (() => {
                                    // VARIATION PRODUCT
                                    if (variant) {
                                      return (
                                        variant.stock !== null &&
                                        variant.stock <= 0
                                      );
                                    }

                                    // SIMPLE PRODUCT
                                    return (
                                      product.stock !== null &&
                                      product.stock <= 0
                                    );
                                  })();

                                  const unitPrice: number = (() => {
                                    if (variant) {
                                      return product.isOnSale
                                        ? variant.salePrice ??
                                            variant.price ??
                                            0
                                        : variant.price ?? 0;
                                    }

                                    return product.isOnSale
                                      ? product.salePrice ?? product.price ?? 0
                                      : product.price ?? 0;
                                  })();

                                  const imageIndex = variant?.imageIndex ?? 0;

                                  return (
                                    <tr
                                      key={item.id}
                                      className="border-b last:border-b-0 align-middle"
                                    >
                                      {/* PRODUCT */}
                                      <td className="py-4 px-4">
                                        <div className="flex items-center gap-4">
                                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2 shrink-0">
                                            <Image
                                              src={
                                                product.image?.[imageIndex] ??
                                                "/placeholder.png"
                                              }
                                              alt={product.name}
                                              className="w-16 h-auto object-cover"
                                              width={1280}
                                              height={720}
                                            />
                                          </div>

                                          <div className="text-sm flex flex-col min-w-0">
                                            <div className="flex justify-between gap-4">
                                              <span className="text-foreground truncate">
                                                {product.name}
                                              </span>
                                              <span className="text-foreground/50 shrink-0">
                                                × {item.quantity}
                                              </span>
                                            </div>

                                            {variant && (
                                              <span className="text-xs text-foreground/50">
                                                {variant.name
                                                  .split(" - ")[0]
                                                  .trim()}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </td>

                                      {/* UNIT PRICE */}
                                      <td className="py-4 px-4 text-center text-foreground/80 whitespace-nowrap">
                                        {currency}
                                        {formatMoney(unitPrice)} / pc
                                      </td>

                                      {/* TOTAL */}
                                      <td className="py-4 px-4 text-center font-medium whitespace-nowrap">
                                        {currency}
                                        {formatMoney(unitPrice * item.quantity)}
                                      </td>

                                      {/* ACTION */}
                                      <td className="py-4 px-4 text-center">
                                        {isOutOfStock ? (
                                          <Button
                                            disabled
                                            variant="outline"
                                            className="h-8 cursor-not-allowed text-foreground border-destructive"
                                          >
                                            Sold out
                                          </Button>
                                        ) : (
                                          <Button
                                            onClick={() => {
                                              handleBuyNow({
                                                productId: product.id,
                                                variantId: variant?.id ?? null,
                                                quantity: 1,
                                              });
                                            }}
                                            className="h-8 text-white cursor-pointer"
                                          >
                                            Buy Again
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div className="my-5 w-full border-t-3 border-dashed border-primary"></div>
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

export default MyOrders;
