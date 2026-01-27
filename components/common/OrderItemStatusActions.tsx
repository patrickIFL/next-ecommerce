"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";
import { FulfillmentStatus } from "@/src/generated/prisma";
import { FULFILLMENT_STATUS_LABELS } from "@/domain/fulfillment/labels";

type Props = {
  orderItemId: string;
  status: FulfillmentStatus;
  disabled?: boolean;
};

export default function OrderItemStatusActions({
  orderItemId,
  status,
  disabled,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAdvance = () => {
    startTransition(async () => {
      const res = await fetch(
        `/api/order-item/advance/${orderItemId}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error ?? "Unable to advance status");
        return;
      }

      toast.success("Status advanced");
      router.refresh();
    });
  };

  const label = FULFILLMENT_STATUS_LABELS[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled={disabled || isPending}
          onClick={handleAdvance}
          className="text-xs px-2 py-1 rounded border border-transparent
                     hover:border-primary transition-all
                     bg-green-500/10 text-green-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating…" : label}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Advance</p>
      </TooltipContent>
    </Tooltip>
  );
}
