import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const products = [
  {
    id: 1,
    image: assets.girl_with_headphone_image,
    title: "Unparalleled Sound",
    description: "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: assets.girl_with_earphone_image,
    title: "Stay Connected",
    description: "Compact and stylish earphones for every occasion.",
  },
  {
    id: 3,
    image: assets.boy_with_laptop_image,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
  {
    id: 4,
    image: assets.boy_with_laptop_image,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14 flex flex-col items-center">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-primary hover:bg-primary-hover my-5" />
      </div>

      {/* ✅ NO overflow wrapper */}
      <Carousel
        opts={{ align: "start" }}
        className="relative w-[70vw] sm:w-[80vw]"
      >
        <CarouselContent>
          {products.map(({ id, image, title, description }) => (
            <CarouselItem
              key={id}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="relative group">
                <Image
                  src={image}
                  alt={title}
                  className="transition duration-300 w-full h-auto object-cover rounded-md"
                />

                <div className="absolute bottom-8 left-8 text-white space-y-2 transition group-hover:-translate-y-1">
                  <p className="font-medium text-xl lg:text-2xl">{title}</p>
                  <p className="text-sm lg:text-base leading-5 max-w-60">
                    {description}
                  </p>

                  <Button className="flex text-white cursor-pointer items-center gap-1.5 bg-primary hover:bg-primary-hover px-4 py-2">
                    Buy now
                    <SquareArrowOutUpRight size={16} />
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ✅ Now visible */}
        <CarouselPrevious className="cursor-pointer"/>
        <CarouselNext className="cursor-pointer"/>
      </Carousel>
    </div>
  );
};


export default FeaturedProduct;
