/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import Link from 'next/link'

function AccordionMenu({ isOpen, isDark, menus }: { isOpen: boolean, isDark: boolean, menus: any }) {

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
          <Accordion type="single" collapsible className="w-full" defaultValue="account">

            {/* Account */}
            <AccordionItem value="account">
              <AccordionTrigger>Account</AccordionTrigger>


              <AccordionContent className="flex flex-col gap-1 text-balance font-normal">
                <Link href="#">
                  <div className={`${menuItemClass} px-4`}>
                  Seller Dashboard</div>
                </Link>
                <Link href="#">
                  <div className={`${menuItemClass} px-4`}>
                  Preferences</div>
                </Link>
                <Link href="#">
                  <div className={`${menuItemClass} px-4`}>
                  Logout</div>
                </Link>
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
  )
}

export default AccordionMenu
