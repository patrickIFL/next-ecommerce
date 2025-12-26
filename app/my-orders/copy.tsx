"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import useOrderHook from "@/hooks/useOrderHook";
import { formatMoney } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import { PackageOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Box_icon from "@/components/svgs/Box_icon";
import Image from "next/image";

const MyOrders: React.FC = () => {
  const router = useRouter();
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

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

  const toggleOrder = (orderId: string) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading || refetching) return <Loading />;

  if (!orders.length) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="No orders yet"
        description="Your orders will appear here once you’ve made a purchase."
        actionText="Continue Shopping"
        onAction={() => router.push("/")}
      />
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 py-6 min-h-screen mt-16">
      <h2 className="text-lg font-medium mb-6">My Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-accent bg-accent">
              <th className="p-3">Order</th>
              <th className="p-3">Shipping</th>
              <th className="p-3">Amount</th>
              <th className="p-3 text-right">Info</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order: any) => {
              const isOpen = openOrderId === order.id;

              return (
                <>
                  {/* ================= ORDER SUMMARY ROW ================= */}
                  <tr
                    key={order.id}
                    className="border-b border-accent cursor-pointer hover:bg-accent/40"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Box_icon orderId={order.id} />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            Order #{order.id.slice(-6)}
                          </span>
                          <span className="text-xs text-foreground/60">
                            {order.items.length} items
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="font-medium">
                        {order.shippingAddress?.fullName}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.province}
                      </p>
                    </td>

                    <td className="p-3 font-medium">
                      {currency}
                      {formatMoney(order.amount)}
                    </td>

                    <td className="p-3 text-right">
                      {isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </td>
                  </tr>

                  {/* ================= ORDER ITEMS ================= */}
                  {isOpen &&
                    order.items.map((item: any) => {
                      const product = item.product;
                      const variant = item.variant ?? null;

                      const unitPrice = variant
                        ? variant.salePrice ?? variant.price
                        : product.salePrice ?? product.price;

                      const imageIndex = variant?.imageIndex ?? 0;

                      return (
                        <tr
                          key={item.id}
                          className="bg-muted/30 border-b border-accent"
                        >
                          {/* PRODUCT */}
                          <td className="p-3">
                            <div className="flex items-center gap-4 pl-8">
                              <div className="rounded-lg bg-gray-500/10 p-2">
                                <Image
                                  src={
                                    product.image?.[imageIndex] ??
                                    "/placeholder.png"
                                  }
                                  alt={product.name}
                                  width={56}
                                  height={56}
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {product.name}
                                </span>

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

                          {/* SHIPPING (EMPTY FOR ALIGNMENT) */}
                          <td />

                          {/* PRICE */}
                          <td className="p-3">
                            {currency}
                            {formatMoney(unitPrice)} × {item.quantity}
                          </td>

                          {/* TOTAL */}
                          <td className="p-3 text-right font-medium">
                            {currency}
                            {formatMoney(unitPrice * item.quantity)}
                          </td>
                        </tr>
                      );
                    })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
