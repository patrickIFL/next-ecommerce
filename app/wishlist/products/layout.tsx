import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist - NextCart",
  description: "View and manage your saved favorite products in your personal NextCart wishlist.",
};
function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

export default layout;



