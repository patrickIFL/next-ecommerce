"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CirclePlus,
  PackageCheck,
  ClipboardList,
  SquareStar,
  ChartColumnBig,
  FileBox,
} from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();
  const menuItems = [
    {
      name: "Add Product",
      path: "/seller",
      icon: CirclePlus,
    },

    {
      name: "Product List",
      path: "/seller/product-list",
      icon: ClipboardList,
    },

    {
      name: "Orders",
      path: "/seller/orders",
      icon: PackageCheck,
    },

    {
      name: "Banners",
      path: "/seller/banner",
      icon: SquareStar,
    },
    {
      name: "Analytics",
      path: "/seller/analytics",
      icon: ChartColumnBig,
    },
    {
      name: "Suppliers",
      path: "/seller/supplier",
      icon: FileBox,
    },
  ];

  return (
    <div className="mt-16 bg-background lg:w-64 w-16 border-r sticky left-0 min-h-screen text-base border-gray-500/30 py-2 flex flex-col z-48">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 ${
                isActive
                  ? "border-r-4 lg:border-r-[6px] bg-primary/50 border-primary"
                  : "hover:bg-accent border-white"
              }`}
            >
              <item.icon size={25} strokeWidth={1.5} />
              <p className="lg:block hidden text-center">{item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
