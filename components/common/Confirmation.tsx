"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Confirmation({
  onConfirm,
  children,
  message,
  title,
  confirmMessage,
  btnVariant = "default",
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  message?: string;
  title?: string;
  confirmMessage?: string;
  btnVariant?: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {message || "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction className={
            btnVariant === "default" 
            ? `bg-red-600 hover:bg-red-700 cursor-pointer text-white` 
            : `bg-amber-500 hover:bg-amber-600 cursor-pointer text-white`} 
            
            onClick={onConfirm}>{confirmMessage || "Confirm"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
