"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="h-8 w-8 rounded-full"
      variant="outline"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ArrowLeft />
    </Button>
  );
}
