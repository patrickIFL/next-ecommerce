"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string | null;
  onAction?: () => void;
  icon?: any;
}

export default function EmptyState({
  title = "Nothing here",
  description = "No data available at the moment.",
  onAction,
  actionText = "Button",
  icon = AlertCircle,
}: EmptyStateProps) {
  const IconComponent = icon;
  return (
    <div className="w-full max-w-md mx-auto mt-12 text-center p-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <IconComponent className="text-gray-400 w-12 h-12" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        {actionText && onAction && (
          <Button className="  hover:bg-accent" variant="outline" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
