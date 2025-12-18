import { useState } from "react"
import { Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function VariationActions() {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button">
          <Settings
            size={20}
            className={`cursor-pointer transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Update")}>
          Update
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Archive")}>
          Archive
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => console.log("Remove")}
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
