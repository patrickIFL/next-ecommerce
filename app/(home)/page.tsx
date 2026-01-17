import Banner from "@/components/homepage/Banner";
import FeaturedProduct from "@/components/homepage/FeaturedProduct";
import HeaderSlider from "@/components/homepage/HeaderSlider";
import HomeProducts from "@/components/homepage/HomeProducts";
import Newsletter from "@/components/homepage/Newsletter";
import prisma from "../db/prisma";
import redis from "@/lib/redis";
import { cache } from "react";
import { FEATURED_PRODUCTS_CACHE_KEY, HOME_PRODUCTS_CACHE_KEY } from "@/lib/cacheKeys";
import { CACHE_TTL } from "@/lib/cacheTTL";

const fetchHomeProducts = cache(async () => {
  const cached = await redis.get(HOME_PRODUCTS_CACHE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }

  const products = await prisma.product.findMany({
    where: { isArchived: false },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  await redis.set(
    HOME_PRODUCTS_CACHE_KEY,
    JSON.stringify(products),
    "EX",
    CACHE_TTL.HOME_PRODUCTS
  );

  return products;
});

const fetchFeaturedProducts = cache(async () => {
  const cached = await redis.get(FEATURED_PRODUCTS_CACHE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      isFeatured: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
    },
  });

  await redis.set(
    FEATURED_PRODUCTS_CACHE_KEY,
    JSON.stringify(products),
    "EX",
    CACHE_TTL.FEATURED_PRODUCTS
  );

  return products;
});

export default async function Home() {
  const [homeProducts, featuredProducts] = await Promise.all([
    fetchHomeProducts(),
    fetchFeaturedProducts(),
  ]);

  return (
    <div className="px-6 md:px-16 lg:px-32 flex flex-col justify-center mt-16">
      <HeaderSlider />
      <HomeProducts homeProducts={homeProducts} />
      <FeaturedProduct products={featuredProducts} />
      <Banner />
      <Newsletter />
    </div>
  );
}
