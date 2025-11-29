"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext, OrderItem } from "@/context/AppContext";
import Loading from "@/components/Loading";

const MyOrders: React.FC = () => {
  const {
    currency,
    myOrders: orders,
    myOrdersLoading: loading,
    isRefetchingMyOrders: refetching
  } = useAppContext();


  return (
    <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen mt-16">
      <div className="space-y-5">
        <h2 className="text-lg font-medium mt-6">My Orders</h2>

        {loading || refetching ? (
          <Loading />
        ) : (
          <div className="max-w-5xl border-t border-gray-300 text-sm">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
              >
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />

                  <p className="flex flex-col gap-3">
                    <span className="font-medium text-base">
                      {order.items
                        .map(
                          (item: OrderItem) =>
                            `${item.product.name} x ${item.quantity}`
                        )
                        .join(", ")}
                    </span>

                    <span>Items : {order.items.length}</span>
                  </p>
                </div>

                <div>
                  <p>
                    <span className="font-medium">
                      {order.shippingAddress?.fullName}
                    </span>
                    <br />
                    <span>{order.shippingAddress?.area}</span>
                    <br />
                    <span>{`${order.shippingAddress?.city}, ${order.shippingAddress?.province}`}</span>
                    <br />
                    <span>{order.shippingAddress?.phoneNumber}</span>
                  </p>
                </div>

                <p className="font-medium my-auto">
                  {currency}
                  {order.amount}
                </p>

                <div>
                  <p className="flex flex-col">
                    <span>Method : COD</span>
                    <span>
                      Date : {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                    <span>Payment : Pending</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
