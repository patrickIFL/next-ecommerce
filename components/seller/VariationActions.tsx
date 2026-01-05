import { useState } from "react"
import { Eye, Settings, SquarePen, TicketPercent, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function VariationActions() {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button">
          <Settings
          strokeWidth={1.5}
            size={20}
            className={`  transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="text-foreground">
        <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Update")}>
          <SquarePen size={16} />
          <span>Update</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Archive")}>
          <TicketPercent size={16} />
          <span>Put on Sale</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Archive")}>
          <Eye size={16} />
          <span>Archive</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => console.log("Remove")}
        >
         <Trash2 size={16} className="text-destructive"/>
          <span>Remove</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
