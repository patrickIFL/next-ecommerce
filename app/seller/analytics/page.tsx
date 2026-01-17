"use client"

import SellerPageTitle from "@/components/seller/SellerPageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PhilippinePeso } from "lucide-react";
const currency = process.env.NEXT_PUBLIC_CURRENCY;

function AnalyticsPage() {

  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <SellerPageTitle title="Analytics" />

      <>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<PhilippinePeso className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{currency}24,345</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Sales</CardTitle>
						<PhilippinePeso className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>+435</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Subscriptions</CardTitle>
						<PhilippinePeso className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>+212</div>
					</CardContent>
				</Card>
			</div>

			<div className='flex flex-wrap gap-5 my-5'>
				<BestSellers />
				<UnfulfilledOrders />
			</div>
		</>
    </div>
  );
}

export default AnalyticsPage;

type BestSeller = {
  product: {
    id: string
    name: string
    image?: string
  }
  unitsSold: number
  revenue: number // cents
}

type UnfulfilledOrder = {
  id: string
  orderDate: Date
  amount: number
  shippingMethod: string
  shippingStatus?: string | null
  itemsCount: number
}



const BestSellers = () => {
  const bestSellers: BestSeller[] = [
    {
      product: {
        id: "p1",
        name: "Wireless Headphones",
        image: "",
      },
      unitsSold: 120,
      revenue: 24_000,
    },
    {
      product: {
        id: "p2",
        name: "Mechanical Keyboard",
        image: "",
      },
      unitsSold: 85,
      revenue: 17_000,
    },
  ]

  return (
    <Card className="flex-1">
      <CardHeader className="px-3">
        <CardTitle>Best Sellers</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 px-3">
        {bestSellers.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No sales data available
          </p>
        )}

        {bestSellers.map((item, index) => (
          <div
            key={item.product.id}
            className="flex items-center gap-3"
          >
            {/* Optional product image */}
            
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src={item.product.image || "/product-placeholder.png"}
                alt={item.product.name}
              />
              <AvatarFallback>
                {item.product.name[0]}
              </AvatarFallback>
            </Avatar> 
           

            <div className="grid gap-1">
              <p className="text-xs font-medium leading-none">
                {index + 1}. {item.product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.unitsSold} sold
              </p>
            </div>

            <div className="ml-auto text-xs font-medium">
              {currency}{(item.revenue / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
const UnfulfilledOrders = () => {
   const {
      data: allOrders = [],
      // isLoading,
      // isError,
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


  return (
    <Card className="flex-1">
      <CardHeader className="px-3">
        <CardTitle>Unfulfilled Orders</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 px-3">
        {allOrders.length === 0 && (
          <p className="text-sm text-muted-foreground">
            All orders are fulfilled
          </p>
        )}

        {allOrders.map((order:UnfulfilledOrder) => (
          <div
            key={order.id}
            className="flex items-center gap-3"
          >
            <div className="grid gap-1">
              <p className="text-xs font-medium leading-none">
                Order #{order.id.slice(-6)}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.itemsCount} items • {order.shippingMethod}
              </p>
              <p className="text-xs text-muted-foreground">
                {/* {order.orderDate.toLocaleDateString()} */}
              </p>
            </div>

            <div className="ml-auto text-right">
              <p className="text-xs font-medium">
                {currency}{(order.amount / 100).toFixed(2)}
              </p>
              <p className="text-[10px] text-orange-500">
                Pending fulfillment
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

