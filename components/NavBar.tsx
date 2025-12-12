"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import NavLinks from "./NavLinks";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme } from "./theme-provider";
import {
  LoaderIcon,
  Menu,
  MessageCircleMore,
  SearchIcon,
  User,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  // NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
} from "./ui/navigation-menu";
import AccordionMenu from "./AccordionMenu";
import { useClerk, useUser } from "@clerk/nextjs";
import ClerkUserButton from "./ClerkUserButton";
import useSearchStore from "@/stores/useSearchStore";
// import { useRouter } from "next/navigation";
import useSearchHook from "@/hooks/useSearchHook";
import { useParams, usePathname } from "next/navigation";
import NextLogo from "./NextLogo";

function NavBar() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);


  // Close the Hamburger Menu When Resizing to Large
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsOpen(false); // lg breakpoint and above
    }
  };
  window.addEventListener("resize", handleResize);
  // Run once on mount
  handleResize();
  return () => window.removeEventListener("resize", handleResize);
}, []);

// Detect click outside of the mobile menu
const handleOutsideClick = (e: MouseEvent) => {
  const menu = document.getElementById("mobile-menu");
  const hamburger = document.getElementById("hamburger-btn");

  // ⭐ NEW: allow clicks inside Clerk portal menu
  const clerkMenu = document.querySelector(".cl-userButton-popover");

  if (
    isOpen &&
    menu &&
    !menu.contains(e.target as Node) &&
    hamburger &&
    !hamburger.contains(e.target as Node) &&
    (!clerkMenu || !clerkMenu.contains(e.target as Node)) // <-- ignore Clerk popup clicks
  ) {
    setIsOpen(false);
  }
};


useEffect(() => {
  document.addEventListener("mousedown", handleOutsideClick);
  return () => document.removeEventListener("mousedown", handleOutsideClick);
});





  // For the Nav links
  const menus = [
    {
      mainTitle: "Shop",
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
      mainTitle: "About",
      mainLink: "",
      menuLinks: [
        {
          linkName: "Our Story",
          linkRef: "#",
        },
        {
          linkName: "What we do",
          linkRef: "#",
        },
        {
          linkName: "Why choose us",
          linkRef: "#",
        },
        {
          linkName: "Our Team",
          linkRef: "#",
        },
      ],
    },
    {
      mainTitle: "Support",
      mainLink: "",
      menuLinks: [
        {
          linkName: "Contact Us",
          linkRef: "#",
        },
        {
          linkName: "FAQs",
          linkRef: "#",
        },
      ],
    },
    {
      mainTitle: "Guides",
      mainLink: "",
      menuLinks: [
        {
          linkName: "Buying Guides",
          linkRef: "#",
        },
        {
          linkName: "Product Tips",
          linkRef: "#",
        },
        {
          linkName: "Articles",
          linkRef: "#",
        },
      ],
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between 
  px-6 xl:px-16 border-b z-50 bg-background
  ${isDark ? "border-gray-700" : "border-gray-300"}`}
      >
        {/* Logo will Change Depending on Theme. */}
        <Link href={"/"}>
          {isDark ? (
            <NextLogo size={150} />
          ) : (
            <NextLogo size={150}/>
          )}
        </Link>
        <div className="relative hidden lg:block">
          <NavLinks menus={menus} />
        </div>



        <NavigationMenu
          viewport={false}
          className="text-foreground items-center h-full"
        >
          <NavigationMenuList>
            <NavigationMenuItem asChild>
              {/* Modify at the Bottom */}
              <SearchBar />
            </NavigationMenuItem>

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
                <TooltipTrigger>
                  <div className="hidden lg:flex hover:bg-accent cursor-pointer items-center p-2 rounded-full">
                    <MessageCircleMore
                      color={"var(--color-foreground)"}
                      size={18}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chat</p>
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
                  className="cursor-pointer hover:bg-accent py-1 px-3 rounded-full flex items-center gap-2 transition"
                >
                  <User color={"var(--color-foreground)"} size={18} />
                  <span>Account</span>
                </button>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Hamburger/Accordion Trigger */}
        <button
          id="hamburger-btn"
          className="flex lg:hidden text-foreground relative w-8 h-8 items-center justify-center cursor-pointer"
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
      </nav>

      {/* Mobile Menu Overlay + Sliding Menu */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black lg:hidden z-49"
            />
          </>
        )}
      </AnimatePresence>
            
      {/* Mobile Menu */}
      <div id="mobile-menu">
        <AccordionMenu
          isDark={isDark}
          isOpen={isOpen}
          menus={menus}
          openSignIn={openSignIn}
        // accountMenu={accountMenu}
        />
      </div>
    </>
  );
}

export default NavBar;

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { handleSearch, searchLoading } = useSearchHook();
  const params = useParams();
  console.log(params.cat)
  // const router = useRouter();

  useEffect(() => {
    if (params.cat) {
      setSearchQuery(params.cat);
    }
  }, [params.cat, setSearchQuery]);


  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSearch();
    }}>
      <div className="flex h-9 items-center mx-5 sm:mx-0 gap-2 sm:min-w-sm md:min-w-md lg:min-w-full border px-3 rounded-sm">
        <button type="submit">
          {searchLoading 
          ? <LoaderIcon className="animate-spin size-4 shrink-0 opacity-50 text-foreground" /> 
          : <SearchIcon className="size-4 shrink-0 opacity-50 text-foreground" />}
        </button>
        <input
          type="text"
          disabled={searchLoading}
          name="search"
          autoComplete="off"
          value={searchQuery}
          placeholder="Search a product"
          className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden 
          disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
        />
      </div>
    </form>
  );
};
