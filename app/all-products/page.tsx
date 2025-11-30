'use client'
import ProductCard from "@/components/ProductCard";
import useProductHook from "@/hooks/useProductHook";

const AllProducts = () => {

    const { products } = useProductHook();

    return (
        <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
            <div className="flex flex-col items-end pt-12">
                <p className="text-2xl font-medium">All products</p>
                <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                {products.map((product, index) => <ProductCard key={index} product={product} />)}
            </div>
        </div>
    );
};

export default AllProducts;
