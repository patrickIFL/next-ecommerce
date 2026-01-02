"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { assets } from "@/assets/assets";

type ImageItem = {
  index: number;
  url: string;
};

type Props = {
  images: ImageItem[];
  value: number | null;
  onChange: (index: number) => void;
};

export function ImagePicker({ images, value, onChange }: Props) {
  const selected = images.find((img) => img.index === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 justify-between w-20 overflow-hidden"
        >
          {selected ? (
            <Image
              src={selected.url}
              alt=""
              width={28}
              height={28}
              className="rounded object-cover "
            />
          ) : (
            <Image
              src={assets.upload_area}
              alt=""
              width={28}
              height={28}
              className="rounded object-cover"
            />
          )}
          <ChevronDown size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-2 gap-2">
          {images.length === 0 && (
            <p className="text-xs col-span-2 text-center">No images found.</p>
          )}
          {images.map((img) => {
            const isSelected = img.index === value;
            return (
              <button
                key={img.index}
                onClick={() => onChange(img.index)} // image state of the parent
                className="relative rounded overflow-hidden border hover:ring-2 hover:ring-primary transition"
              >
                <Image
                  src={img.url}
                  alt=""
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />

                {isSelected && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Check className="text-white" size={20} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
