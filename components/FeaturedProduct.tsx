import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

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
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-500 cursor-pointer hover:bg-orange-600 my-5"></div>
      </div>

      <div className="flex overflow-x-scroll scrollbar-hide gap-8 lg:gap-14">
  {products.map(({ id, image, title, description }) => (
    <div
      key={id}
      className="relative 
        min-w-full
        sm:min-w-[50%]
        md:min-w-[calc((100%-7rem)/3)]
        xl:min-w-[calc((100%-11rem)/4)]"
    >
      <Image
        src={image}
        alt={title}
        className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
      />

      <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
        <p className="font-medium text-xl lg:text-2xl">{title}</p>
        <p className="text-sm lg:text-base leading-5 max-w-60">
          {description}
        </p>

        <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
          Buy now
          <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default FeaturedProduct;
