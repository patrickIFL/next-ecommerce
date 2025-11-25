"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";

const ProductCard = ({ product }: { product: any }) => {
    const { currency } = useAppContext();
    const router = useRouter();
    const { getToken } = useAuth(); // ⭐ get Clerk session token

    const handleAddToCart = async () => {
        try {
            const token = await getToken();

            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 1
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Add to cart error:", data);
                return;
            }

            router.push("/cart");

        } catch (err) {
            console.error("Add to cart failed:", err);
        }
    };

    return (
        <div
            onClick={() => { router.push('/product/' + product.id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full"
        >
            <div className="overflow-hidden group relative bg-gray-500/10 rounded-lg rounded-b-none w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full cursor-pointer"
                    width={800}
                    height={800}
                />
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Image
                        className="h-3 w-3"
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500 max-sm:hidden truncate">{product.description}</p>
            <div className="flex items-center gap-2">
                <p className="text-xs">{4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(4)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();  // prevent navigation
                        handleAddToCart();
                    }}
                    className="max-sm:hidden px-4 py-1.5 text-foreground border border-foreground rounded-full text-xs hover:bg-foreground hover:text-background transition cursor-pointer"
                >
                    Buy now
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
