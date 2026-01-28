"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
  disabled = false,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isDisabled = disabled || isPending;
  const label = FULFILLMENT_STATUS_LABELS[status];

  const handleAdvance = () => {
    if (isDisabled) return;

    startTransition(async () => {
      const res = await fetch(`/api/order-item/advance/${orderItemId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error ?? "Unable to advance status");
        return;
      }

      toast.success("Status advanced");
      router.refresh();
    });
  };

  const button = (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleAdvance}
      className={`text-xs px-2 py-1 rounded border transition-all
        ${
          status === "DELIVERED"
            ? "bg-green-600/10 text-green-600 border-transparent"
            : "bg-amber-600/10 text-amber-600 border-transparent enabled:hover:border-amber-600"
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isPending ? "Updating…" : label}
    </button>
  );

  // 🚫 No tooltip when disabled
  if (isDisabled) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">
        <p>Advance</p>
      </TooltipContent>
    </Tooltip>
  );
}
