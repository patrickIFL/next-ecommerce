"use client";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme } from "../theme-provider";
import {
  ChevronDown,
  LoaderIcon,
  Menu,
  SearchIcon,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { Search, Loader2, ChevronsUpDown, Check } from "lucide-react";
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
} from "../ui/navigation-menu";
import { useClerk, useUser } from "@clerk/nextjs";
import ClerkUserButton from "./ClerkUserButton";
import useSearchStore from "@/stores/useSearchStore";
// import { useRouter } from "next/navigation";
import useSearchHook from "@/hooks/useSearchHook";
import { useParams, usePathname } from "next/navigation";
import NextLogo from "../svgs/NextLogo";
import AccordionMenu from "./AccordionMenu";
import { useCartUI } from "@/stores/useCartUI";

const CATEGORY_PRESETS = [
  { label: "All", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home", value: "home" },
  { label: "Beauty", value: "beauty" },
  { label: "Sports", value: "sports" },
];

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
          linkRef: "#",
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-16 flex border-b z-50 bg-background
  ${isDark ? "border-gray-700" : "border-gray-300"}`}
      >
        <div
          className="flex items-center justify-between gap-2 sm:gap-4 md:gap-10 
  px-6 xl:px-16 w-full max-w-7xl mx-auto"
        >
          {/* Logo will Change Depending on Theme. */}
          <Link href={"/"}>
            {isDark ? <NextLogo size={150} /> : <NextLogo size={150} />}
          </Link>

          <div className="relative hidden lg:block">
            <NavLinks menus={menus} />
          </div>

          <div className="flex-1">
            <SearchBar />
          </div>
          <NavigationMenu
            viewport={false}
            className="text-foreground items-center h-full"
          >
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

          {/* Mobile Hamburger/Accordion Trigger */}
          <button
            id="hamburger-btn"
            className="flex lg:hidden text-foreground relative w-8 h-8 items-center justify-center"
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
        </div>
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

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import NavLinks from "./NavLinks";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { handleSearch, searchLoading } = useSearchHook();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (params.cat) {
      setCategory(params.cat as string);
    }
  }, [params.cat]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="mx-5 sm:mx-0"
    >
      <div className="flex h-10 items-center rounded-md border bg-background px-2">
        {/* Search Button */}
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={searchLoading}
        >
          {searchLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
        </Button>

        {/* Search Input */}
        <input
          disabled={searchLoading}
          value={searchQuery}
          placeholder="Search a product"
          className="border-0 w-full text-sm px-2 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="hidden sm:flex items-center">
          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-border" />

          {/* Category Combobox */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                disabled={searchLoading}
                className="h-8 px-2 text-xs gap-1"
              >
                {CATEGORY_PRESETS.find((c) => c.value === category)?.label ??
                  "Category"}
                <ChevronsUpDown className="size-3 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-0" align="end">
              <Command>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {CATEGORY_PRESETS.map((cat) => (
                    <CommandItem
                      key={cat.value}
                      value={cat.value}
                      onSelect={() => {
                        setCategory(cat.value);
                        setOpen(false);
                        handleSearch(cat.value);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          category === cat.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {cat.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </form>
  );
};
