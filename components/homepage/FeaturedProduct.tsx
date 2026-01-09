"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { Button } from "../ui/button";
import { SquareArrowOutUpRight, StarOff } from "lucide-react";
import EmptyState from "../common/EmptyState";
import useUserStore from "@/stores/useUserStore";
import { useRouter } from "next/navigation";

const CARD_HEIGHT = 360;

type FeaturedProductProps = {
  products: Array<{
    id: string;
    name: string;
    description: string | null;
    image: string[];
  }>;
};

const FeaturedProduct = ({ products }: FeaturedProductProps) => {
  const { isSeller } = useUserStore();
  const router = useRouter();

  return (
    <section className="mt-14 flex flex-col items-center w-full">
      {/* HEADER */}
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-primary my-5" />
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={StarOff}
          title="Nothing Featured Yet"
          description="Stay tuned for the next featured products."
          actionText={isSeller ? "Add Featured Products" : null}
          onAction={() => router.push("/seller/product-list")}
        />
      ) : (
        <Carousel opts={{ align: "start" }} className="relative w-[70vw] sm:w-[80vw]">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div
                  className="relative w-full overflow-hidden rounded-lg"
                  style={{ height: CARD_HEIGHT }}
                >
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <p className="font-medium text-lg line-clamp-1">
                      {product.name}
                    </p>

                    <p className="text-sm line-clamp-2 max-w-[90%]">
                      {product.description}
                    </p>

                    <Button
                      onClick={() => {
                        router.push("/product/" + product.id);
                        scrollTo(0, 0);
                      }}
                      size="sm"
                      className="mt-2 flex items-center gap-1.5 bg-primary hover:bg-primary-hover"
                    >
                      Buy now
                      <SquareArrowOutUpRight size={14} />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
};

export default FeaturedProduct;
