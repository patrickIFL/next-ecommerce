"use client";

import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

import ClerkUserButton from "./ClerkUserButton";
import { useCartUI } from "@/stores/useCartUI";

import { Dispatch, SetStateAction } from "react";
import { MenuType, MobileDrawer } from "./NavBar";

interface AccordionMenuProps {
  setDrawer: Dispatch<SetStateAction<MobileDrawer>>;
  menus: MenuType[];
  openSignIn: () => void;
}

export default function AccordionMenu({
  setDrawer,
  menus,
  openSignIn,
}: AccordionMenuProps) {
  const { user } = useClerk();

  const menuItemClass =
    "hover:bg-accent transition px-4 py-2 flex rounded-sm text-left w-full text-sm";

  return (
    <Accordion type="single" collapsible className="w-full">
      {/* ===================== TOP ACTIONS ===================== */}
      <AccordionItem value="actions" className="border-none">
        <div className="flex items-center justify-between py-2">
          {/* Theme + Cart */}
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <AnimatedThemeToggler className="p-2 border rounded-full cursor-pointer hover:bg-accent" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => useCartUI.getState().openCart()}
                  className="p-2 border rounded-full cursor-pointer hover:bg-accent"
                >
                  <ShoppingCart size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>

            {/* Search */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => setDrawer("search")}
                  className="flex items-center justify-center p-2 border rounded-full cursor-pointer hover:bg-accent"
                >
                  <Search size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Cart</TooltipContent>
            </Tooltip>
          </div>

          {/* Account */}
          <div>
            {user ? (
              <ClerkUserButton />
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 border rounded-md px-3 py-1.5 hover:bg-accent transition"
              >
                <User size={16} />
                <span className="text-sm">Account</span>
              </button>
            )}
          </div>
        </div>
      </AccordionItem>

      {/* ===================== NAV MENUS ===================== */}
      {menus.map((menu, i) => {
        const isDirectLink =
          menu.mainLink !== "" && menu.menuLinks.length === 0;

        const value = `menu-${i}`;

        /* Direct Link */
        if (isDirectLink) {
          return (
            <AccordionItem value={value} key={value}>
              <Link href={menu.mainLink}>
                <div className={`${menuItemClass} font-medium`}>
                  {menu.mainTitle}
                </div>
              </Link>
            </AccordionItem>
          );
        }

        /* Dropdown Menu */
        return (
          <AccordionItem value={value} key={value}>
            <AccordionTrigger>{menu.mainTitle}</AccordionTrigger>

            <AccordionContent className="flex flex-col gap-1 font-normal">
              {menu.menuLinks.map((link, j) => (
                <Link key={j} href={link.linkRef || "#"}>
                  <div className={menuItemClass}>{link.linkName}</div>
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
