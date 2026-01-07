import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - NextCart",
  description: "Review your order and complete payment securely in NextCart.",
};
function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default layout;
