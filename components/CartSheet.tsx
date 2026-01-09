import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductPageTitle from "@/components/common/ProductPageTitle";
import CartContent from "@/components/cart/CartContent";

export function CartSheet() {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ShoppingCart color="var(--color-foreground)" size={18} />
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <ProductPageTitle title="Your Cart" className="pt-0" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <CartContent compact />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
