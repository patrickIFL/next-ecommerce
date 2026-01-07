import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products - NextCart",
  description: "Browse all available products in NextCart",
};
function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

export default layout;
