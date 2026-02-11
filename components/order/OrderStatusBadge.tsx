import { OrderStatus } from "@/src/generated/prisma";

const STATUS: Record<OrderStatus, string> = {
  AWAITING_CONFIRMATION: "CONFIRMATION",
  CONFIRMED: "CONFIRMED",
  SOURCING: "PREPARING",
  IN_PROGRESS: "IN PROGRESS",
  COMPLETED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const label = STATUS[status];

  return (
    <span
      className={`px-2 py-1 text-xs border rounded ${
        status === "COMPLETED"
          ? "border-green-600 text-green-600 bg-green-600/10"
          : "border-amber-300 text-amber-500 bg-amber-300/20"
      }`}
    >
      {label}
    </span>
  );
}
