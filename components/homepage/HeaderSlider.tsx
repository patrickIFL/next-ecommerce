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
 Template 
{
      id: 1,
      type: "png",
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
*/

import Image from "next/image";
import { MoveRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../ui/button";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ImageBanner from "./ImageBanner";
import { Skeleton } from "../ui/skeleton";
import { Slide } from "@/lib/types";

const fetchBanners = async (): Promise<Slide[]> => {
  const res = await fetch("/api/banner/list");
  if (!res.ok) throw new Error("Failed to fetch banners");
  return res.json();
};

const HeaderSlider = () => {
  /* ---------------------------------------------
   * Autoplay configuration
   * ------------------------------------------- */
  const plugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
    })
  );

  /* ---------------------------------------------
   * Embla API state
   * ------------------------------------------- */
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [slideEnabled, setSlideEnabled] = useState(true);

  /* ---------------------------------------------
   * Fetch banners
   * ------------------------------------------- */
  const { data: sliderData = [], isLoading } = useQuery({
    queryKey: ["header-banners"],
    queryFn: fetchBanners,
    staleTime: 1000 * 60, // 1 min
  });

  /* ---------------------------------------------
   * Carousel listeners
   * ------------------------------------------- */
  useEffect(() => {
  if (!api) return () => {};

  const onSelect = () => {
    setSelectedIndex(api.selectedScrollSnap());
  };

  setScrollSnaps(api.scrollSnapList());
  setSelectedIndex(api.selectedScrollSnap());

  api.on("select", onSelect);

  return () => {
    api.off("select", onSelect);
  };
}, [api]);


  if (isLoading) {
    return <HeaderSliderSkeleton />;
  }

  if (sliderData.length === 0) {
    return null;
  }

  return (
    <header>
      <Carousel
        setApi={setApi}
        opts={{ loop: false }}
        plugins={slideEnabled ? [plugin.current] : []}
        onMouseEnter={() => {
          plugin.current.stop();
          setSlideEnabled(false);
        }}
        onMouseLeave={() => {
          plugin.current.reset();
          setSlideEnabled(true);
        }}
        className="relative"
      >
        <CarouselContent>
          {sliderData.map((slide, index) => {
            /* ---------------- PNG SLIDES ---------------- */
            if (slide.type === "png") {
              return (
                <CarouselItem key={slide.id}>
                  <div
                    className={`flex flex-col-reverse md:flex-row
                    items-center justify-between
                    bg-slider px-5 md:px-14 py-8
                    rounded-b-xl
                    min-h-[560px] 
                    md:min-h-[400px]`}
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

                        <Button variant="ghost" className="group flex gap-2">
                          {slide.buttonText2}
                          <MoveRight className="group-hover:translate-x-1 transition" />
                        </Button>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="flex flex-1 items-center justify-center">
                      <Image
                        src={slide.imgSrc}
                        alt=""
                        width={400}
                        height={300}
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
        <CarouselPrevious className="-translate-x-1/2 left-0" />
        <CarouselNext className="translate-x-1/2 right-0" />

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
            />
          ))}
        </div>
      </Carousel>
    </header>
  );
};

export default HeaderSlider;

const HeaderSliderSkeleton = () => {
  return (
    <header>
      <div
        className={`
          relative
          bg-slider
          rounded-b-xl
          px-5 md:px-14 py-8
          min-h-[560px]
          md:min-h-[400px]
        `}
      >
        <div className="flex flex-col-reverse md:flex-row items-center justify-between h-full">
          {/* Text Skeleton */}
          <div className="md:pl-8 mt-10 md:mt-0 max-w-xl w-full space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full max-w-[420px]" />
            <Skeleton className="h-10 w-full max-w-[380px]" />

            <div className="flex gap-4 mt-6">
              <Skeleton className="h-11 w-32 rounded-full" />
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="flex flex-1 items-center justify-center w-full">
            <Skeleton className="h-[260px] w-[260px] md:h-80 md:w-80 rounded-xl" />
          </div>
        </div>

        {/* Dots Skeleton */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-2 w-2 rounded-full" />
          ))}
        </div>
      </div>
    </header>
  );
};
