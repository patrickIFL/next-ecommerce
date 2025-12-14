import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PhilippinePeso, Trash2 } from "lucide-react";
import { ImagePicker } from "./ImagePicker";

type VariationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function VariationModal({ open, onOpenChange }: VariationModalProps) {
  const images = [
  { index: 0, url: "https://res.cloudinary.com/dlgc8nx7r/image/upload/v1765630030/ibeidgyol31utfgdrgqk.png" },
  { index: 1, url: "https://res.cloudinary.com/dlgc8nx7r/image/upload/v1765630030/ibeidgyol31utfgdrgqk.png" },
  // { index: 2, url: "https://res.cloudinary.com/dlgc8nx7r/image/upload/v1765630030/ibeidgyol31utfgdrgqk.png" },
  // { index: 3, url: "https://res.cloudinary.com/dlgc8nx7r/image/upload/v1765630030/ibeidgyol31utfgdrgqk.png" },
];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Variations for Tshirt </DialogTitle>
            <DialogDescription>
              Make changes to variation. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* sku, price, salePrice, stock, image */}
            <div className="relative border p-4 rounded-md grid gap-2">
              <Label className="font">Small, Yellow - Tshirt</Label>
              {/* divider */}
              <div className="w-full h-px bg-foreground"></div>
              {/* main content */}
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="font-normal text-xs">Image</Label>
                  <ImagePicker
                    images={images}
                    // value={variation.imageIndex}
                    value={0}
                    // onChange={(index) => onChange({ imageIndex: index })}
                    onChange={() => {}}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="font-normal text-xs">SKU</Label>
                  <Input
                    id="name-1"
                    name="name"
                    defaultValue="Pedro Duarte"
                    className="focus-visible:ring-0 transition selection:bg-foreground/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="font-normal text-xs">Stock</Label>
                  <Input
                    id="name-1"
                    name="name"
                    defaultValue="Pedro Duarte"
                    className="focus-visible:ring-0 transition selection:bg-foreground/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="font-normal text-xs">Price</Label>
                  <div className="flex items-center">
                    <PhilippinePeso size={17} />
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue="Pedro Duarte"
                      className="focus-visible:ring-0 transition selection:bg-foreground/50"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="font-normal text-xs">Sale Price</Label>

                  <div className="flex items-center">
                    <PhilippinePeso size={17} />
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue="Pedro Duarte"
                      className="focus-visible:ring-0 transition selection:bg-foreground/50"
                    />
                  </div>
                </div>
              </div>
              {/* delete button */}
              <div>
                <Button className="h-7 w-7 absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  <Trash2 />
                </Button>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Usernme</Label>
              <Input
                className="
    focus-visible:ring-0
    transition
    selection:bg-gray-300
  "
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="text-gray-100">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
