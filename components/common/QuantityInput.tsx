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
import { ScrollArea } from "@/components/ui/scroll-area";

type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

export function QuantityInput({
  value,
  onChange,
  max = 10,
}: QuantityInputProps) {
  const [open, setOpen] = React.useState(false);

  const quantities = React.useMemo(
    () => Array.from({ length: max }, (_, i) => i + 1),
    [max]
  );

  const decrease = () => {
    onChange(Math.max(1, value - 1));
  };

  const increase = () => {
    onChange(Math.min(max, value + 1));
  };

  return (
    <div className="flex items-center gap-1">
      {/* MINUS */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={value <= 1}
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
            {value}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[50px] p-0">
          <Command>
            <ScrollArea className="h-40">
              <CommandList className="scrollbar-hide">
                <CommandGroup>
                  {quantities.map((n) => (
                    <CommandItem
                      key={n}
                      value={n.toString()}
                      onSelect={() => {
                        onChange(n);
                        setOpen(false);
                      }}
                      className="justify-between"
                    >
                      {n}
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === n ? "opacity-100" : "opacity-0"
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
        disabled={value >= max}
        className="h-[25px] w-[25px]"
      >
        <Plus size={14} />
      </Button>
    </div>
  );
}
