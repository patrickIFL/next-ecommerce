/* eslint-disable @typescript-eslint/no-explicit-any */
import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddressComboBox from "@/components/AddressComboBox"
import { Input } from "./ui/input";

// ------------------------
// Types
// ------------------------
interface Address {
  fullName: string;
  phoneNumber: string;
  zipcode: number;
  area: string;
  city: string;
  province: string;
}


const OrderSummary = ({ cartCount, cartAmount }: {cartCount:any, cartAmount:any}) => {
  const { currency,
    // getCartCount, getCartAmount
  } = useAppContext();

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

        <div>
          <label className="text-base font-medium uppercase text-text-foreground/80 block mb-2">
            Address
          </label>
        <AddressComboBox link={'/add-address'} className="w-full font-normal bg-accent"/>
        </div>
    

        {/* Promo Code */}
        <div>
          <label className="text-base font-medium uppercase text-text-foreground/80 block mb-2">
            Promo Code
          </label>

          <div className="flex flex-col items-start gap-3">
            
            <Input type="text"
              placeholder="Enter promo code"
              className="grow w-full outline-none p-2.5"/>
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-foreground">Items {cartCount}</p>
            <p className="text-foreground">
              {currency}
              {cartAmount}
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
              {Math.floor(cartAmount * 0.02)}

            </p>
          </div>

          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {cartAmount + Math.floor(cartAmount * 0.02)}

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
