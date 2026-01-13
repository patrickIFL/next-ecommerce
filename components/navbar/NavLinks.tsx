/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

function NavLinks({ menus }: { menus: any }) {
  const navItemClass = "text-md font-normal";
  return (
    <div className="relative grow-0">
      <NavigationMenu viewport={false} className="text-foreground">
        <NavigationMenuList>
          {menus.map((menu: any, i: number) => {
            const isDirectLink =
              menu.mainLink !== "" && menu.menuLinks.length === 0;

            return isDirectLink ? (
              <NavigationMenuItem key={i}>
                {/* Additional Padding because no down arrow */}
                <NavigationMenuLink
                  asChild
                  className={`px-7 py-[7px] rounded-md ${navItemClass}`}
                >
                  <Link href={menu.mainLink}>{menu.mainTitle}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={i}>
                <NavigationMenuTrigger className={navItemClass}>
                  {menu.mainTitle}
                </NavigationMenuTrigger>

                <NavigationMenuContent className="absolute min-w-[200px] z-50">
                  <ul className="grid w-[200px] gap-1 text-foreground">
                    {menu.menuLinks.map((link: any, j: number) => (
                      <li key={j}>
                        <NavigationMenuLink asChild>
                          <Link href={link.linkRef || "#"}>
                            {link.linkName}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default NavLinks;
