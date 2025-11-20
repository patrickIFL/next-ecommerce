import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// ------------------------
// Types
// ------------------------
interface Address {
  fullName: string;
  area: string;
  city: string;
  state: string;
}

const OrderSummary: React.FC = () => {
  const { currency, getCartCount, getCartAmount } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);

  const router = useRouter();

  // ------------------------
  // Fetch addresses
  // ------------------------
  const fetchUserAddresses = async (): Promise<void> => {
    // If addressDummyData is typed correctly in assets, no cast needed
    setUserAddresses(addressDummyData as Address[]);
  };

  const handleAddressSelect = (address: Address): void => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async (): Promise<void> => {
    // TODO: your order logic here
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <div className="w-full md:w-96 bg-accent p-5">
      <h2 className="text-xl md:text-2xl font-medium text-foreground">
        Order Summary
      </h2>

      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        {/* Address Selector */}
        <div>
          <label className="text-base font-medium uppercase text-foreground block mb-2">
            Select Address
          </label>

          <div className="relative inline-block w-full text-sm border">
            <button
              type="button"
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>

              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}

                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-base font-medium uppercase text-text-foreground/80 block mb-2">
            Promo Code
          </label>

          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-foreground border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-foreground">Items {getCartCount()}</p>
            <p className="text-foreground">
              {currency}
              {getCartAmount()}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-foreground/80">Shipping Fee</p>
            <p className="font-medium text-foreground">Free</p>
          </div>

          <div className="flex justify-between">
            <p className="text-foreground/80">Tax (2%)</p>
            <p className="font-medium text-foreground">
              {currency}
              {Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>

          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {getCartAmount() + Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
