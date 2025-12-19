import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function QuantityInput({
  max,
}: {
  max?: number; // optional stock limit
}) {
  const [qty, setQty] = useState(1);

  const decrease = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    setQty((prev) => (max ? Math.min(max, prev + 1) : prev + 1));
  };

  return (
    <div className="flex items-center gap-1">
      {/* MINUS */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={qty <= 1}
        className="h-[25px] w-[25px] cursor-pointer"
      >
        <Minus size={14} />
      </Button>

      {/* INPUT */}
      <Input
        type="number"
        value={qty}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!value || value < 1) return;
          if (max && value > max) return;
          setQty(value);
        }}
        className="w-[60px] h-[25px] text-center 
          [appearance:textfield] 
          [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none"
      />

      {/* PLUS */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={increase}
        disabled={max ? qty >= max : false}
        className="h-[25px] w-[25px] cursor-pointer"
      >
        <Plus size={14} />
      </Button>
    </div>
  );
}
