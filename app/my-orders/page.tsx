"use client";

/* eslint-disable @typescript-eslint/no-explicit-any*/
import { assets } from "@/assets/assets";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import useOrderHook from "@/hooks/useOrderHook";
import { formatMoney } from "@/lib/utils";

const MyOrders: React.FC = () => {
  const {
    myOrders: orders,
    myOrdersLoading: loading,
    refetchMyOrders,
    isRefetchingMyOrders: refetching
  } = useOrderHook();

  const currency = process.env.NEXT_PUBLIC_CURRENCY

  useEffect(() => {
    refetchMyOrders();
  }, [refetchMyOrders]);

  return (
    <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen mt-16">
      <div className="space-y-5">
        <h2 className="text-lg font-medium mt-6">My Orders</h2>

        {loading || refetching ? (
          <Loading />
        ) : (
          <>
            <div className="max-w-6xl mx-auto overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-accent bg-accent text-foreground">
                    <th className="p-3">Product</th>
                    <th className="p-3">Shipping Details</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Info</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order: any, i: number) => (
                    <tr key={i} className="border-b border-accent">
                      {/* PRODUCT */}
                      <td className="p-3 align-top">
                        <div className="flex gap-3">
                          <Image
                            className="w-16 h-16 object-cover"
                            src={assets.box_icon}
                            alt="box_icon"
                          />
                          <div className="flex flex-col gap-2">
                            <span className="font-medium">
                              {order.items
                                .map((item: any) => `${item.product.name} x ${item.quantity}`)
                                .join(", ")}
                            </span>
                            <span>Items: {order.items.length}</span>
                          </div>
                        </div>
                      </td>

                      {/* SHIPPING ADDRESS */}
                      <td className="p-3 align-top">
                        <p>
                          <span className="font-medium">{order.shippingAddress?.fullName}</span>
                          <br />
                          {order.shippingAddress?.area}
                          <br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.province}
                          <br />
                          {order.shippingAddress?.phoneNumber}
                        </p>
                      </td>

                      {/* AMOUNT */}
                      <td className="p-3 align-top font-medium">
                        {currency}{formatMoney(order.amount)} {/* since price was stored as cents */}
                      </td>

                      {/* INFO */}
                      <td className="p-3 align-top">
                        <p className="flex flex-col">
                          <span>Method: COD</span>
                          <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                          <span>Payment: Pending</span>
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
