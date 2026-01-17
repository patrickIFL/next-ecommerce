/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount:number){
    const formatted = (amount/100).toLocaleString('en-PH');
    return formatted;
}

export function getMinMaxPrice(product: any) {
    // VARIATION PRODUCT
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const prices = product.variants
        .map((variant: any) => {
          if (product.isOnSale) {
            return variant.salePrice ?? variant.price;
          }
          return variant.price;
        })
        .filter((price: number | null) => typeof price === "number");

      if (prices.length === 0) {
        return { min: 0, max: 0 };
      }

      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }

    // SIMPLE PRODUCT
    const price = product.isOnSale
      ? product.salePrice ?? product.price
      : product.price;

    return {
      min: price,
      max: price,
    };
}

export function isValidImageUrl(url?: string) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Next Steps: Apply this to every component and page that uses product image URL 