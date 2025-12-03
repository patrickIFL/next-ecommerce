/* eslint-disable @typescript-eslint/no-explicit-any */
import AddressComboBox from "@/components/AddressComboBox";
import { Input } from "./ui/input";
import useOrderHook from "@/hooks/useOrderHook";
import { formatMoney } from "@/lib/utils";
import { Button } from "./ui/button";

const OrderSummary = ({
  cartCount,
  cartAmount,
}: {
  cartCount: any;
  cartAmount: any;
}) => {
  const { placeOrder } = useOrderHook();
  const tax = Number(process.env.NEXT_PUBLIC_TAX);
  const shipping = Number(process.env.NEXT_PUBLIC_SHIPPING);
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const handlePlaceOrder = () => {
    placeOrder();
  };

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
          <AddressComboBox
            link={"/add-address"}
            className="w-full font-normal bg-accent"
          />
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-base font-medium uppercase text-text-foreground/80 block mb-2">
            Promo Code
          </label>

          <div className="flex flex-col items-start gap-3">
            <Input
              type="text"
              placeholder="Enter promo code"
              className="grow w-full outline-none p-2.5"
            />
            <Button className="cursor-pointer bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </Button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-foreground">Items {cartCount}</p>
            <p className="text-foreground">
              {currency}{formatMoney(cartAmount)}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-foreground/80">Shipping Fee</p>
            <p className="font-medium text-foreground">
              {shipping > 0 ? `₱${shipping}` : "Free"}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-foreground/80">Tax ({tax}%)</p>
            <p className="font-medium text-foreground">
              {currency}{formatMoney(Math.floor(cartAmount * (tax / 100)))}
            </p>
          </div>

          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}{formatMoney(cartAmount + Math.floor(cartAmount * 0.02))}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        className="cursor-pointer w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </Button>
    </div>
  );
};

export default OrderSummary;
