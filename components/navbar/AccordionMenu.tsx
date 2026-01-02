/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { MessageCircleMore, User } from "lucide-react";
// import { UserButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ClerkUserButton from "./ClerkUserButton";

function AccordionMenu({
  isOpen,
  isDark,
  menus,
  openSignIn,
}: // accountMenu
{
  isOpen: boolean;
  isDark: boolean;
  menus: any;
  openSignIn: any;
  // accountMenu: any;
}) {
  const { user } = useClerk();
  const menuItemClass =
    "hover:bg-accent transition py-2 flex rounded-sm text-left w-full !text-md";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`fixed top-13 right-0 w-64 lg:hidden px-6 py-6 text-foreground 
            font-medium text-center rounded-bl-md z-49 bg-background
            flex flex-col items-center justify-start 
            ${isDark ? "border border-gray-700" : "border border-gray-300"}`}
          style={{ backdropFilter: "blur(8px)" }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="account"
          >
            {/* Dark mode and Search */}
            <AccordionItem className="border-none pt-3" value="theme-search">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <AnimatedThemeToggler className="hover:bg-accent p-2 cursor-pointer border rounded-full" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle Theme</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="hover:bg-accent flex items-center border rounded-full cursor-pointer">
                        <MessageCircleMore
                          color={"var(--color-foreground)"}
                          size={18}
                          className="m-2"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chats</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div>
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
                      onClick={openSignIn}
                      className="w-full cursor-pointer hover:bg-accent rounded-md py-2 px-3 flex items-center justify-center gap-2 transition border"
                    >
                      <User color={"var(--color-foreground)"} size={18} />
                      <span className="text-sm ml-0.5">Account</span>
                    </button>
                  )}
                </div>
              </div>
            </AccordionItem>
            
            {/* Dynamic Menus */}
            {menus.map((menu: any, i: number) => {
              const isDirectLink =
                menu.mainLink !== "" && menu.menuLinks.length === 0;

              const accordionValue = `menu-${i}`;

              return isDirectLink ? (
                // ⭐ Direct Link
                <AccordionItem value={accordionValue} key={i}>
                  {/* Fake trigger look without arrow */}
                  <Link href={menu.mainLink}>
                    <div className={`${menuItemClass} text-sm ml-px py-4`}>
                      {menu.mainTitle}
                    </div>
                  </Link>
                </AccordionItem>
              ) : (
                // ⭐ Dropdown
                <AccordionItem value={accordionValue} key={i}>
                  <AccordionTrigger>{menu.mainTitle}</AccordionTrigger>

                  <AccordionContent className="flex flex-col gap-1 text-balance font-normal">
                    {menu.menuLinks.map((link: any, j: number) => (
                      <Link key={j} href={link.linkRef || "#"}>
                        <div className={`${menuItemClass} px-4`}>
                          {link.linkName}
                        </div>
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
            
          </Accordion>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AccordionMenu;
