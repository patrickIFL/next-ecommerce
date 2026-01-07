import SideBar from "@/components/seller/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Dashboard – NextCart",
  description: "Manage products, monitor inventory, and track sales performance from your centralized seller control panel.",
};


function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full">
      <SideBar />
      {children}
    </div>
  );
}

export default layout;
