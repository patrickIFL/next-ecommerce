/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Settings,
  SquareArrowOutUpRight,
  SquarePen,
  Star,
  TicketPercent,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useActionsProductHook from "@/hooks/useActionsProductHook";
import { useRouter } from "next/navigation";
import Confirmation from "../common/Confirmation";

export function ProductActions({ product }: { product: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    isFeatured,
    isArchived,
    onSale,
    isDeleting,
    deleteProduct,
    toggleFeatured,
    isTogglingFeatured,
    toggleArchive,
    toggleSale,
    isTogglingSale,
  } = useActionsProductHook({ product });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button">
          <Settings
            strokeWidth={1.5}
            size={20}
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="text-foreground w-35">
        {/* FEATURE */}
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={isTogglingFeatured}
          onClick={() => {
            toggleFeatured(product.id);
            setOpen(false);
          }}
        >
          <Star size={16} />
          <span>{isFeatured ? "Unfeature" : "Feature"}</span>
        </DropdownMenuItem>

        {/* SALE */}
        <Confirmation
          title={
            onSale
              ? `End SALE for ${product.name}?`
              : `Put ${product.name} on SALE?`
          }
          confirmMessage={onSale ? "End SALE" : "Put on SALE"}
          btnVariant="default"
          onConfirm={() => {
            toggleSale(product.id);
            setOpen(false);
          }}
        >
          <DropdownMenuItem
          className="cursor-pointer"
            onSelect={(e) => e.preventDefault()}
            disabled={isTogglingSale}
          >
            <TicketPercent size={16} />
            <span>{onSale ? "End SALE" : "Put on SALE"}</span>
          </DropdownMenuItem>
        </Confirmation>

        {/* VIEW */}
        <DropdownMenuItem
        className="cursor-pointer"
          onClick={() => {
            router.push(`/product/${product.id}`);
            setOpen(false);
          }}
        >
          <SquareArrowOutUpRight size={16} />
          <span>See Product</span>
        </DropdownMenuItem>

        {/* EDIT */}
        <DropdownMenuItem
        className="cursor-pointer"
          onClick={() => {
            router.push(`/seller/edit-product/${product.id}`);
            setOpen(false);
          }}
        >
          <SquarePen size={16} />
          <span>Edit</span>
        </DropdownMenuItem>

        {/* ARCHIVE */}
        <Confirmation
        
          title={
            isArchived
              ? `Unarchive ${product.name}?`
              : `Archive ${product.name}?`
          }
          confirmMessage={isArchived ? "Unarchive" : "Archive"}
          btnVariant="default"
          onConfirm={() => {
            toggleArchive(product.id);
            setOpen(false);
          }}
        >
          <DropdownMenuItem
          
            onSelect={(e) => e.preventDefault()}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            {isArchived ? <Eye size={16} className="text-destructive"/> : <EyeOff size={16} className="text-destructive"/>}
            <span>{isArchived ? "Unarchive" : "Archive"}</span>
          </DropdownMenuItem>
        </Confirmation>

        {/* DELETE */}
        <Confirmation
          title={`Delete ${product.name}?`}
          confirmMessage="Delete"
          btnVariant="default"
          onConfirm={() => {
            deleteProduct(product.id);
            setOpen(false);
          }}
        >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-destructive focus:text-destructive cursor-pointer"
            disabled={isDeleting}
          >
            <Trash2 size={16} className="text-destructive" />
            <span>Delete</span>
          </DropdownMenuItem>
        </Confirmation>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
