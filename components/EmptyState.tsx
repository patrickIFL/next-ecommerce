"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "Nothing here",
  description = "No data available at the moment.",
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-12 text-center p-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertCircle className="text-gray-400 w-12 h-12" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        {actionText && onAction && (
          <Button variant="outline" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
