"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface Product {
  imageUrl: string
  productUrl: string
}
interface ProductCirclesProps {
  className?: string
  numProducts?: number
  productUrls: Product[]
  toggleList?: () => void
}

export const ProductCircles = ({
  numProducts,
  className,
  productUrls,
  toggleList
}: ProductCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {productUrls.map((url, index) => (
        <a
          key={index}
          href={url.productUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            key={index}
            className="cursor-pointer h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
            src={url.imageUrl}
            width={40}
            height={40}
            alt={`Avatar ${index + 1}`}
          />
        </a>
      ))}
      {(numProducts ?? 0) > 0 && (
        <div
          className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
          onClick={toggleList}
        >
          +{numProducts}
        </div>
      )}
    </div>
  )
}
