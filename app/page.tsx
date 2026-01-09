import Banner from "@/components/homepage/Banner";
import FeaturedProduct from "@/components/homepage/FeaturedProduct";
import HeaderSlider from "@/components/homepage/HeaderSlider";
import HomeProducts from "@/components/homepage/HomeProducts";
import Newsletter from "@/components/homepage/Newsletter";
import prisma from "./db/prisma";
import { cache } from "react";

const fetchFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
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
});

const fetchHomeProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isArchived: false },
    include: {variants: true},
    orderBy: { createdAt: "desc" },
    take: 12,
  });
});

export default async function Home() {
  const [homeProducts, featuredProducts] = await Promise.all([
    fetchHomeProducts(),
    fetchFeaturedProducts(),
  ]);

  // Prisma → Client safety
  const safeHome = JSON.parse(JSON.stringify(homeProducts));
  const safeFeatured = JSON.parse(JSON.stringify(featuredProducts));

  return (
    <div className="px-6 md:px-16 lg:px-32 flex flex-col justify-center mt-16">
      <HeaderSlider />
      <HomeProducts homeProducts={safeHome} />
      <FeaturedProduct products={safeFeatured} />
      <Banner />
      <Newsletter />
    </div>
  );
}
