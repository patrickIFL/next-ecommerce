"use client";

import * as React from "react";
import { Check, ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

interface AddressComboBoxProps {
  className?: string;
  link: string;
}

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  region: string;
  province: string;
  city: string;
  area: string;
  zipcode: string;
}

export default function AddressComboBox({ className, link }: AddressComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const router = useRouter();
  const { getToken } = useAuth();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const token = await getToken();

      const { data } = await axios.get("/api/user/get-address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.addresses as Address[];
    },
  });

  const selectedAddress = addresses?.find((a) => a.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[260px] justify-between ${className ?? ""}`}
        >
          <span className="truncate max-w-[250px]">
  {selectedAddress
    ? `${selectedAddress.area}, ${selectedAddress.city}`
    : "Select address..."}
</span>
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <div className="flex items-center gap-2 p-2">
            <CommandInput placeholder="Search Address..." className="h-9" />
            <Button
              size="sm"
              onClick={() => router.push(link)}
              className="cursor-pointer bg-accent rounded-full hover:bg-accent/80"
            >
              <Plus className="text-foreground" />
            </Button>
          </div>

          <CommandList>
            <CommandEmpty>No Address found.</CommandEmpty>

            <CommandGroup>
              {!isLoading &&
                addresses?.map((address) => (
                  <CommandItem
                    key={address.id}
                    value={address.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="py-3"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div>
                        <p className="text-sm font-semibold">{address.fullName} | <span className="text-xs font-normal text-foreground/80">{address.phoneNumber}</span></p>
                        <p className="text-xs text-foreground/80">
                          {address.area}
                        </p>

                        <p className="text-xs text-foreground/80">
                          {address.city}, {address.province}, {address.zipcode}
                        </p>
                      </div>
                    </div>

                    <Check
                      className={`ml-auto ${
                        value === address.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
