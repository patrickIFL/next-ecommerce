'use client';
/* eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { formatMoney } from "@/lib/utils";

const Orders: React.FC = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY
  const { data: allOrders, isLoading: allOrdersLoading, refetch: refetchAllOrders, isRefetching: isRefetchingAllOrders } = useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      const res = await fetch("/api/order/seller-orders");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders");
      }
      return data.orders;
    }
  })

  useEffect(() => {
    refetchAllOrders();
  }, [refetchAllOrders]);

  return (
    <div className="flex-1 h-screen overflow-scroll scrollbar-hide flex flex-col justify-between text-sm">
      {allOrdersLoading || isRefetchingAllOrders ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="flex-1 h-screen overflow-scroll scrollbar-hide flex flex-col text-sm">
            {allOrdersLoading || isRefetchingAllOrders ? (
              <Loading />
            ) : (

              <>

                <h2 className="text-lg font-medium">Orders</h2>

                <div className="max-w-5xl overflow-x-auto">
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
                      {allOrders.map((order: any, i: number) => (
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
                            {currency}{formatMoney(order.amount)}
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
      )}
    </div>
  );
};

export default Orders;
