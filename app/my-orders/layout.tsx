import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders - NextCart",
  description:
    "View and track your order history, including past purchases, order statuses, and transaction details in NextCart.",
};
function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default layout;
