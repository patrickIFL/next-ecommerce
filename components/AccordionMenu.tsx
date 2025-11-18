/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Link from "next/link";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { Search } from "lucide-react";

function AccordionMenu({
  isOpen,
  isDark,
  menus,
  accountMenu
}: {
  isOpen: boolean;
  isDark: boolean;
  menus: any;
  accountMenu: any;
}) {
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
          className={`fixed top-13 right-0 w-64 md:hidden px-6 py-6 text-foreground 
            font-medium text-center rounded-bl-md z-40 bg-background
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
            <AccordionItem className="border-none" value="theme-search">
              <div className="flex justify-end gap-3">
                <AnimatedThemeToggler className="p-2 cursor-pointer border rounded-full" />
                <div className="border rounded-full">
                  <Search color={"var(--color-foreground)"} size={18} className="m-2"/>
                </div>
              </div>
            </AccordionItem>

            {/* Account */}
            <AccordionItem value="account">
              <AccordionTrigger>{accountMenu.mainText}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1 text-balance font-normal">
                  {accountMenu.links.length > 0 
                    && (accountMenu.links.map((link:any, i:number)=>(
                          <div onClick={link.linkFunction} key={i} className="cursor-pointer">
                            <div className={`${menuItemClass} px-4`}>
                              {link.linkText}
                            </div>
                          </div>
                    ))
                  )}
              </AccordionContent>
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
                      <Link key={j} href={link.href || "#"}>
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
