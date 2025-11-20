import Banner from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div className="px-6 md:px-16 lg:px-32 flex flex-col justify-center">
      <HeaderSlider />
      <HomeProducts />
      <FeaturedProduct />
      <Banner />
      <Newsletter />
    </div>
  );
}
