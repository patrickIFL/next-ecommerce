import prisma from "@/app/db/prisma";
import { cache } from "react";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/common/BackButton";
import { Hourglass, Package2, PhilippinePeso, Truck, User } from "lucide-react";
const currency = process.env.NEXT_PUBLIC_CURRENCY;

const getOrderById = cache(async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      payment: true,
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
    title: `${order.id} - NextCart`,
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

  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <div className="flex flex-col mb-2">
          <p className="text-2xl font-medium">{`Order# ${order?.id ?? ""}`}</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      </div>
      <>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col flex-2 gap-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex flex-col font-medium">
                  <span className="text-lg font-semibold">Status</span>
                  <span className="text-xs text-foreground/80 font-normal">
                    Current Order Status
                  </span>
                </CardTitle>
                <Hourglass className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* Status Contents Start */}
                <div className="flex gap-2 bg-accent p-2 rounded-lg">
                  
                    <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                      <div className="flex items-center justify-center bg-accent rounded-full w-7 h-7">
                        <Hourglass className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="font-semibold">Order Confirm</span>
                      <div className="h-1.5 bg-primary rounded-full"></div>
                    </div>

                    <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                      <div className="flex items-center justify-center bg-accent rounded-full w-7 h-7">
                        <Hourglass className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="font-semibold">Order Confirm</span>
                      <div className="h-1.5 bg-accent rounded-full"></div>
                    </div>
                  
                    <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                      <div className="flex items-center justify-center bg-accent rounded-full w-7 h-7">
                        <Hourglass className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="font-semibold">Order Confirm</span>
                      <div className="h-1.5 bg-primary rounded-full"></div>
                    </div>

                    <div className="flex flex-1 flex-col gap-1 font-medium bg-card p-3 rounded-lg border">
                      <div className="flex items-center justify-center bg-accent rounded-full w-7 h-7">
                        <Hourglass className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="font-semibold">Order Confirm</span>
                      <div className="h-1.5 bg-primary rounded-full"></div>
                    </div>
                  
                  {/* Status Contents End */}
                </div>
              </CardContent>
            </Card>

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
                <div className="text-2xl font-bold">{currency}24,345</div>
              </CardContent>
            </Card>

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
                <div className="text-2xl font-bold">{currency}24,345</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col flex-1 gap-3">
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
                <div className="text-2xl font-bold">{currency}24,345</div>
              </CardContent>
            </Card>

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
                <div className="text-2xl font-bold">{currency}24,345</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    </div>
  );
}
