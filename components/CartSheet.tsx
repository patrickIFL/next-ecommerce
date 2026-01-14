import { ReactNode } from "react";
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
import { useRouter } from "next/navigation";
import ProductPageTitle from "@/components/common/ProductPageTitle";
import CartContent from "@/components/cart/CartContent";

interface CartSheetProps {
  children: ReactNode;
}

interface CartSheetProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CartSheet({
  children,
  open,
  onOpenChange,
}: CartSheetProps) {
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <ProductPageTitle title="Your Cart" className="pt-0" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <CartContent compact />
        </div>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button variant="outline">Continue Shopping</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

