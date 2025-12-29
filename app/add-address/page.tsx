"use client";
import AddAddressIcon from "@/components/svgs/AddAddressIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAddressHook from "@/hooks/useAddressHook";
import { LoaderIcon } from "lucide-react";

export default function Page() {
  const {
    addAddress,
    addAddressLoading: isPending,
    address,
    setAddress,
  } = useAddressHook();

  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addAddress(address);
  };

  return (
    <div className="mt-10 px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-center">
      <form
        onSubmit={handleAddAddress}
        className="w-full flex flex-col items-center pt-5 order-2 md:order-1 md:items-start"
      >
        <p className="text-2xl md:text-3xl text-foreground/80 font-semibold">
          Add Shipping{" "}
          <span className="font-semibold text-primary">Address</span>
        </p>

        <div className="space-y-3 max-w-xl md:max-w-sm mt-10">
          <Input
            className="px-2 py-2.5 focus:border-primary transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
            type="text"
            placeholder="Full name"
            value={address.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />

          <Input
            className="px-2 py-2.5 focus:border-primary transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
            type="text"
            placeholder="Phone number"
            value={address.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress({ ...address, phoneNumber: e.target.value })
            }
          />

          <Input
            className="px-2 py-2.5 focus:border-primary transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
            type="text"
            placeholder="Zip code"
            value={address.zipcode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress({ ...address, zipcode: e.target.value })
            }
          />

          <Textarea
            className="px-2 py-2.5 focus:border-primary transition border border-foreground/30 rounded outline-none w-full text-foreground resize-none placeholder:text-foreground/50"
            rows={4}
            placeholder="Address (Area and Street)"
            value={address.area}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setAddress({ ...address, area: e.target.value })
            }
          />

          <div className="flex space-x-3">
            <Input
              className="px-2 py-2.5 focus:border-primary transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
              type="text"
              placeholder="City/District/Town"
              value={address.city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <Input
              className="px-2 py-2.5 focus:border-primary transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
              type="text"
              placeholder="Province"
              value={address.province}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress({ ...address, province: e.target.value })
              }
            />
          </div>
          <Button
            type="submit"
            className={`md:max-w-sm w-full mt-6 text-white py-3 uppercase 
            ${
              isPending
                ? "bg-primary-loading/50"
                : "bg-primary cursor-pointer hover:bg-primary-hover"
            }`}
          >
            {isPending ? (
              <div className="flex gap-2 justify-center items-center">
                <LoaderIcon className="animate-spin text-white" size={16} />
                Loading
              </div>
            ) : (
              "Save address"
            )}
          </Button>
        </div>
      </form>
      <div className="w-full flex items-center order-1 md:order-2 justify-center">
        <AddAddressIcon size={350} />
      </div>
    </div>
  );
}
