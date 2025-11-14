import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <>
    {/* To Fix: Responsiveness */}

      <NavBar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
      </div>
      <Footer />

    </>
  );
}
