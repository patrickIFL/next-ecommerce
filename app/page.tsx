import Banner from "@/components/homepage/Banner";
import FeaturedProduct from "@/components/homepage/FeaturedProduct";
import HeaderSlider from "@/components/homepage/HeaderSlider";
import HomeProducts from "@/components/homepage/HomeProducts";
import Newsletter from "@/components/homepage/Newsletter";

export default function Home() {
  return (
    <div className="px-6 md:px-16 lg:px-32 flex flex-col justify-center mt-16">
      <HeaderSlider />
      <HomeProducts />
      <FeaturedProduct />
      <Banner />
      <Newsletter />
    </div>
  );
}
