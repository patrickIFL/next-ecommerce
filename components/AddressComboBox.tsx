"use client"

import * as React from "react"
import { Check, ChevronDown, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useRouter } from "next/navigation"

const addresses = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

interface AddressComboBoxProps {
  className?: string,
  link:string
}

export default function AddressComboBox({ className, link }: AddressComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between ${className ?? ""}`} // <-- merge classes
        >
          {value
            ? addresses.find((address) => address.value === value)?.label
            : "Select address..."}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0">
  <Command>
    {/* Input + Add button wrapper */}
    <div className="flex items-center justify-between gap-2 p-2">
      <CommandInput
        placeholder="Search Address..."
        className="h-9 w-[210px]"
      />
      <Button
        size="sm"
        onClick={() => {
          router.push(link)
        }}
        className="bg-accent rounded-full cursor-pointer hover:bg-accent/80"
      >
        <Plus className="text-foreground"/>
      </Button>
    </div>

    <CommandList>
      <CommandEmpty>No Address found.</CommandEmpty>
      <CommandGroup>
        {addresses.map((address) => (
          <CommandItem
            key={address.value}
            value={address.value}
            onSelect={(currentValue) => {
              setValue(currentValue === value ? "" : currentValue)
              setOpen(false)
            }}
          >
            {address.label}
            <Check
              className={`ml-auto ${
                value === address.value ? "opacity-100" : "opacity-0"
              }`}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
</PopoverContent>

    </Popover>
  )
}
