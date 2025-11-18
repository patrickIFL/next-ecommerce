"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import NavLinks from "./NavLinks";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme } from "./theme-provider";
import { Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccordionMenu from "./AccordionMenu";

function NavBar() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isSeller = true;

  // Account Dropdown
  

  // For the Nav links
  const menus = [
    {
      mainTitle: "Item One",
      mainLink: "#",
      menuLinks : []
    },
    {
      mainTitle: "Item One",
      mainLink: "",
      menuLinks : [
        {
          linkName: "Components",
          linkRef: "#"
        },
        {
          linkName: "Documentation",
          linkRef: "#"
        },
        {
          linkName: "Blocks",
          linkRef: "#"
        },
      ]
    },
    {
      mainTitle: "Item Three",
      mainLink: "",
      menuLinks : [
        {
          linkName: "Components",
          linkRef: "#"
        },
        {
          linkName: "Documentation",
          linkRef: "#"
        },
        {
          linkName: "Blocks",
          linkRef: "#"
        },
      ]
    },
    {
      mainTitle: "Item Four",
      mainLink: "",
      menuLinks : [
        {
          linkName: "Components",
          linkRef: "#"
        },
        {
          linkName: "Documentation",
          linkRef: "#"
        },
        {
          linkName: "Blocks",
          linkRef: "#"
        },
      ]
    },
  ]

  return (
    <>
      <nav
        className={`flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b 
      ${
        isDark ? "border-gray-700" : "border-gray-300"
      } z-50 relative bg-background`}
      >
        {/* Logo will Change Depending on Theme. */}
        <Link href={'/'}>
          {isDark ? (
            <Image
              className="cursor-pointer w-28 md:w-32"
              onClick={() => {}}
              src={assets.logo_white}
              alt="logo"
            />
          ) : (
            <Image
              className="cursor-pointer w-28 md:w-32"
              onClick={() => {}}
              src={assets.logo}
              alt="logo"
            />
          )}
        </Link>
        <div className="relative hidden md:block">
          <NavLinks menus={menus}/>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden text-foreground relative w-8 h-8 items-center justify-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence>
            {isOpen ? (
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

        <NavigationMenu
          viewport={false}
          className="text-foreground hidden md:flex items-center h-full"
        >
          <NavigationMenuList className="flex gap-2">
            <NavigationMenuItem className="flex items-center rounded-full">
              <AnimatedThemeToggler className="m-2 cursor-pointer" />
            </NavigationMenuItem>

            <NavigationMenuItem className="flex items-center p-2 rounded-full">
              <Search color={"var(--color-foreground)"} size={18} />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md font-normal flex gap-1">
                <User color={"var(--color-foreground)"} size={18} />
                <span>Account</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute min-w-[200px] z-50">
                <ul className="grid w-[200px] gap-4">
                  <li>
                    {
                      isSeller 
                      ? (
                        <NavigationMenuLink asChild>
                          <Link href="/seller">Seller Dashboard</Link>
                        </NavigationMenuLink>
                      ) 
                      : (
                        <NavigationMenuLink asChild>
                          <Link href="#">My Orders</Link>
                        </NavigationMenuLink>
                      )
                    }
                    
                    <NavigationMenuLink asChild>
                      <Link href="#">Preferences</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Logout</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Mobile Menu */}
      <AccordionMenu 
        isDark={isDark} 
        isOpen={isOpen} 
        menus={menus} 
      />
      
    </>
  );
}

export default NavBar;
