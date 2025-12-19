"use client";

import * as React from "react";
import { Minus, Plus, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";

const QUANTITIES = Array.from({ length: 10 }, (_, i) => i + 1);

export function QuantityInput({ max = 10 }: { max?: number }) {
  const [open, setOpen] = React.useState(false);
  const [qty, setQty] = React.useState(1);

  const decrease = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    setQty((prev) => Math.min(max, prev + 1));
  };

  return (
    <div className="flex items-center gap-1">
      {/* MINUS */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={qty <= 1}
        className="h-[25px] w-[25px]"
      >
        <Minus size={14} />
      </Button>

      {/* COMBOBOX */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-[25px] w-[50px] text-center"
          >
            {qty}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[50px] p-0">
                <Command>
                  <ScrollArea className="h-40">
                    <CommandList className="scrollbar-hide">
                      <CommandGroup>
                        {QUANTITIES.filter((n) => n <= max).map((n) => (
                          <CommandItem
                            key={n}
                            value={n.toString()}
                            onSelect={() => {
                              setQty(n);
                              setOpen(false);
                            }}
                            className="justify-between"
                          >
                            {n}
                            <Check
                              className={cn(
                                "h-4 w-4",
                                qty === n ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </ScrollArea>
                </Command>
        </PopoverContent>
      </Popover>

      {/* PLUS */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={increase}
        disabled={qty >= max}
        className="h-[25px] w-[25px]"
      >
        <Plus size={14} />
      </Button>
    </div>
  );
}
