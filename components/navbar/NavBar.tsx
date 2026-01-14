"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingCart, User, X } from "lucide-react";

import { useTheme } from "../theme-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useClerk, useUser } from "@clerk/nextjs";
import ClerkUserButton from "./ClerkUserButton";
import { useCartUI } from "@/stores/useCartUI";

import NavLinks from "./NavLinks";
import AccordionMenu from "./AccordionMenu";
import SearchAccordion from "./SearchAccordion";
import NextLogo from "../svgs/NextLogo";
import SearchBar from "./SearchBar";

export type MobileDrawer = "menu" | "search" | null;

export interface MenuType {
  mainTitle: string;
  mainLink: string;
  menuLinks: {
    linkName: string;
    linkRef: string;
  }[];
}

const menus = [
  {
    mainTitle: "Products",
    mainLink: "#",
    menuLinks: [
      {
        linkName: "All Products",
        linkRef: "/all/products",
      },
      {
        linkName: "Categories",
        linkRef: "#",
      },
      {
        linkName: "Best Sellers",
        linkRef: "#",
      },
      {
        linkName: "Sale",
        linkRef: "#",
      },
    ],
  },
  {
    mainTitle: "Services",
    mainLink: "",
    menuLinks: [
      {
        linkName: "Video Editting",
        linkRef: "/video editting/products",
      },
      {
        linkName: "Graphic Design",
        linkRef: "#",
      },
      {
        linkName: "Logo Design",
        linkRef: "#",
      },
      {
        linkName: "Publication Design",
        linkRef: "#",
      },
      {
        linkName: "Website Development",
        linkRef: "#",
      },
    ],
  },
  {
    mainTitle: "Food Delivery",
    mainLink: "",
    menuLinks: [
      {
        linkName: "Jollibee",
        linkRef: "#",
      },
      {
        linkName: "Mcdonalds",
        linkRef: "#",
      },
      {
        linkName: "Mang Inasal",
        linkRef: "#",
      },
    ],
  },
  {
    mainTitle: "Groceries",
    mainLink: "",
    menuLinks: [
      {
        linkName: "Puregold",
        linkRef: "#",
      },
      {
        linkName: "Royal",
        linkRef: "#",
      },
      {
        linkName: "YBC",
        linkRef: "#",
      },
    ],
  },
];

export default function NavBar() {
  const { isDark } = useTheme();
  const pathname = usePathname();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const [drawer, setDrawer] = useState<MobileDrawer>(null);

  /* Close drawer on route change */
  useEffect(() => {
    setDrawer(null);
  }, [pathname]);

  /* Close drawer when resizing to desktop */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setDrawer(null);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ===================== NAVBAR ===================== */}
      <nav
        className={`fixed top-0 left-0 z-50 w-full h-16 border-b bg-background
        ${isDark ? "border-gray-700" : "border-gray-300"}`}
      >
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center gap-4 px-6 xl:px-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <NextLogo size={150} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:block">
            <NavLinks menus={menus} />
          </div>

          {/* Search */}
          <div className="flex-1 hidden lg:block">
            <SearchBar />
          </div>

          {/* Desktop Actions */}
          <NavigationMenu viewport={false} className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem className="hidden lg:flex hover:bg-accent cursor-pointer items-center rounded-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="hover:bg-accent cursor-pointer flex items-center p-2 rounded-full">
                      <AnimatedThemeToggler className="cursor-pointer" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Theme</p>
                  </TooltipContent>
                </Tooltip>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => useCartUI.getState().openCart()}
                      className="hidden lg:flex hover:bg-accent cursor-pointer items-center p-2 rounded-full"
                    >
                      <ShoppingCart size={16} />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Cart</p>
                  </TooltipContent>
                </Tooltip>
              </NavigationMenuItem>

              <NavigationMenuItem className="hidden lg:flex items-center p-2 rounded-full">
                {user ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ClerkUserButton />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>My Account</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => openSignIn()}
                    className="  hover:bg-accent py-1 px-3 rounded-full flex items-center gap-2 transition"
                  >
                    <User color={"var(--color-foreground)"} size={18} />
                    <span>Account</span>
                  </button>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Triggers */}
          <div className="flex lg:hidden gap-2">
            <button
              onClick={() => setDrawer(drawer ? null : "menu")}
              className="w-8 h-8 flex items-center justify-center"
            >
              <AnimatePresence>
                {drawer ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <X size={28} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <Menu size={28} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ===================== OVERLAY ===================== */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            key="overlay"
            onClick={() => setDrawer(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ===================== MOBILE DRAWER ===================== */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            key="drawer"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`fixed top-13 right-0 
  ${drawer === "search" ? "w-full" : "w-64"}
  transition-[width] duration-300 ease-in-out
  lg:hidden px-6 py-6 text-foreground
  font-medium text-center rounded-bl-md z-49 bg-background
  flex flex-col items-center justify-start
  ${isDark ? "border border-gray-700" : "border border-gray-300"}`}
            style={{ backdropFilter: "blur(8px)" }}
          >
            {drawer === "menu" && (
              <AccordionMenu
                setDrawer={setDrawer}
                menus={menus}
                openSignIn={openSignIn}
              />
            )}

            {drawer === "search" && <SearchAccordion setDrawer={setDrawer} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
