"use client";

/**
 * =========================================================
 * HEADER SLIDER – BANNER IMAGE SPECIFICATIONS
 * =========================================================
 *
 * JPG / WebP Banner Design Sizes:
 *
 * Desktop: 1920 × 400 px
 * Tablet:  1024 × 400 px
 * Mobile:   768 × 540 px
 *
 *
 * Rendering Rules:
 * - JPG banners are rendered as background images
 * - background-size: cover
 * - Fixed container height to avoid layout shift
 * - Same height across all JPG banners
 *
 * PNG slides remain content-driven (image + text layout)
 * =========================================================
 */

import Image from "next/image";
import { MoveRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { assets } from "@/assets/assets";
import { Button } from "./ui/button";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import ImageBanner from "./ImageBanner";
import { useEffect, useRef, useState } from "react";

const HeaderSlider = () => {
  /* ---------------------------------------------
   * Autoplay configuration
   * ------------------------------------------- */
  const sliderInterval = 5; // seconds
  const plugin = useRef(
    Autoplay({
      delay: sliderInterval * 1000,
      stopOnInteraction: true,
    })
  );

  /* ---------------------------------------------
   * Embla API state (for dots)
   * ------------------------------------------- */
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
  if (!api) return;

  const onSelect = () => {
    setSelectedIndex(api.selectedScrollSnap());
  };

  setScrollSnaps(api.scrollSnapList());
  setSelectedIndex(api.selectedScrollSnap());

  api.on("select", onSelect);

  return () => {
    if (api) {
      api.off("select", onSelect);
    }
  };
}, [api]);



  /* ---------------------------------------------
   * Fixed banner heights (JPG slides)
   * ------------------------------------------- *
  /* ---------------------------------------------
   * Slider data
   * ------------------------------------------- */
  const sliderData = [
    {
      id: 1,
      type: "png",
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 2,
      type: "png",
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Buy now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      type: "png",
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
    },
    {
      id: 4,
      type: "jpg",
      desktopImg:
        "https://res.cloudinary.com/dlgc8nx7r/image/upload/v1767067748/desktopBanner_smgktn.jpg",
      tabletImg:
        "https://res.cloudinary.com/dlgc8nx7r/image/upload/v1767067746/tabletBanner_beekpz.jpg",
        mobileImg:
        "https://res.cloudinary.com/dlgc8nx7r/image/upload/v1767067747/mobileBanner_brwneo.jpg",
      },
  ];

  /* ---------------------------------------------
   * Render
   * ------------------------------------------- */
  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: false }}
      className={`relative`}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {sliderData.map((slide, index) => {
          /* ---------------- PNG SLIDES ---------------- */
          if (slide.type === "png") {
            return (
              <CarouselItem key={slide.id}>
                <div
                  className=
                    {`flex flex-col-reverse md:flex-row
                    items-center justify-between
                    bg-slider px-5 md:px-14 py-8
                    rounded-b-xl
                    min-h-[560px] 
                    md:min-h-[400px] 
                   `}
                  
                >
                  {/* Text */}
                  <div className="md:pl-8 mt-10 md:mt-0 max-w-xl">
                    <p className="text-primary pb-1">{slide.offer}</p>

                    <h1 className="md:text-[40px] md:leading-12 text-2xl font-semibold">
                      {slide.title}
                    </h1>

                    <div className="flex gap-4 items-center mt-6">
                      <InteractiveHoverButton>
                        <span>{slide.buttonText1}</span>
                      </InteractiveHoverButton>

                      <Button
                        variant="ghost"
                        className="group flex items-center gap-2 rounded-full cursor-pointer"
                      >
                        {slide.buttonText2}
                        <MoveRight className="group-hover:translate-x-1 transition" />
                      </Button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex flex-1 items-center justify-center">
                    <Image
                      src={slide.imgSrc}
                      alt={`Slide ${index + 1}`}
                      className="max-h-[260px] md:max-h-80 w-auto object-contain"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </CarouselItem>
            );
          }

          /* ---------------- JPG SLIDES ---------------- */
          if (slide.type === "jpg") {
            return (
              <CarouselItem key={slide.id}>
                <ImageBanner slide={slide} />
              </CarouselItem>
            );
          }

          return null;
        })}
      </CarouselContent>

      {/* Arrows */}
      <CarouselPrevious className="-translate-x-1/2 left-0 cursor-pointer" />
      <CarouselNext className="translate-x-1/2 right-0 cursor-pointer" />

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition ${
              index === selectedIndex
                ? "bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default HeaderSlider;
