"use client";

import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Confirmation from "@/components/common/Confirmation";
import { useTransition } from "react";
import { OrderStatus } from "@/src/generated/prisma";
import toast from "react-hot-toast";

type Props = {
  orderId: string;
  status: OrderStatus;
};

const NEXT_STATUS: Record<OrderStatus, string | null> = {
  AWAITING_CONFIRMATION: "Confirm Order",
  CONFIRMED: "Start Sourcing",
  SOURCING: "Mark In Progress",
  IN_PROGRESS: "Complete Order",
  COMPLETED: null,
  CANCELLED: null,
  REFUNDED: null,
};

export default function OrderStatusActions({ orderId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const isTerminal =
    status === OrderStatus.COMPLETED ||
    status === OrderStatus.CANCELLED ||
    status === OrderStatus.REFUNDED;

  const label = NEXT_STATUS[status] ?? "Completed";

  const advanceOrder = async () => {
    startTransition(async () => {
      const res = await fetch(`/api/order/advance/${orderId}`, {
        method: "POST",
      });

      if (!res.ok) {
        toast.error("Failed to advance order");
        return;
      }

      toast.success("Order advanced");
      window.location.reload();
    });
  };

  if (isTerminal) {
    return (
      <Button type="button" disabled variant="outline">
        <Hourglass className="h-4 w-4 mr-2 text-muted-foreground" />
        {label}
      </Button>
    );
  }

  return (
    <Confirmation
      title="Advance Order"
      message={`Are you sure you want to ${label.toLowerCase()}?`}
      confirmMessage="Advance"
      onConfirm={advanceOrder}
    >
      <Button type="button" disabled={isPending} variant="outline">
        <Hourglass className="h-4 w-4 mr-2" />
        {isPending ? "Processing..." : label}
      </Button>
    </Confirmation>
  );
}

