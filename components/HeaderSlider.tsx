"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { Button } from "./ui/button";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = sliderData.length;

const canScrollPrev = currentSlide > 0;
const canScrollNext = currentSlide < slideCount - 1;

  const sliderDuration = 1000 * 5; // 5 seconds

const intervalRef = useRef<NodeJS.Timeout | null>(null);

const startSlider = useCallback(() => {
  if (intervalRef.current) return;

  intervalRef.current = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  }, sliderDuration);
}, [sliderData.length, sliderDuration]);

const stopSlider = useCallback(() => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
}, []);

useEffect(() => {
  startSlider();
  return stopSlider;
}, [startSlider, stopSlider]);

const goToPrev = useCallback(() => {
  if (!canScrollPrev) return;

  stopSlider();
  setCurrentSlide((prev) => prev - 1);
  startSlider();
}, [canScrollPrev, startSlider, stopSlider]);

const goToNext = useCallback(() => {
  if (!canScrollNext) return;

  stopSlider();
  setCurrentSlide((prev) => prev + 1);
  startSlider();
}, [canScrollNext, startSlider, stopSlider]);




  return (
    <div
      className="overflow-hidden relative w-full"
      onMouseEnter={stopSlider}
      onMouseLeave={startSlider}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-slider py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
            // style={{
            //   backgroundImage:
            //     'url("https://plus.unsplash.com/premium_photo-1765263955892-7cf35fa601a9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            // }}
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-primary pb-1">{slide.offer}</p>

              <h1 className="max-w-lg md:text-[40px] md:leading-12 text-2xl font-semibold">
                {slide.title}
              </h1>

              <div className="flex gap-4 items-center mt-4 md:mt-6">
                <Button className="cursor-pointer md:px-10 px-7 md:py-2.5 py-2 bg-primary hover:bg-primary-hover rounded-full text-white font-medium">
                  {slide.buttonText1}
                </Button>

                <Button
                  variant={"ghost"}
                  className="group flex items-center gap-2 cursor-pointer md:py-2.5 py-2 rounded-full text-foreground font-medium px-5!"
                >
                  {slide.buttonText2}
                  <MoveRight className="group-hover:translate-x-1 transition" />
                </Button>
              </div>
            </div>

            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-primary" : "bg-gray-500/30"
            }`}
          />
        ))}
      </div>
      {/* Arrows */}
<Button
  variant="outline"
  size="icon"
  onClick={goToPrev}
  disabled={!canScrollPrev}
  className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 z-10 size-8 shadow-md rounded-full"
>
  <ArrowLeft className="w-5 h-5" />
</Button>

<Button
  variant="outline"
  size="icon"
  onClick={goToNext}
  disabled={!canScrollNext}
  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-10 size-8 shadow-md rounded-full"
>
  <ArrowRight className="w-5 h-5" />
</Button>


    </div>
  );
};

export default HeaderSlider;
