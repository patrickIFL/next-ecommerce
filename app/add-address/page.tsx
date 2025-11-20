'use client'
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState } from "react";

// ------------------
// Address Type
// ------------------
interface AddressForm {
  fullName: string;
  phoneNumber: string;
  zipcode: string;
  area: string;
  city: string;
  province: string;
}

export default function Page() {
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    phoneNumber: "",
    zipcode: "",
    area: "",
    city: "",
    province: "",
  });

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: submit
  };

  return (
    <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
      <form onSubmit={onSubmitHandler} className="w-full">
        <p className="text-2xl md:text-3xl text-foreground/80">
          Add Shipping <span className="font-semibold text-orange-600">Address</span>
        </p>

        <div className="space-y-3 max-w-sm mt-10">
          <input
            className="px-2 py-2.5 focus:border-orange-500 transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
            type="text"
            placeholder="Full name"
            value={address.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />

          <input
            className="px-2 py-2.5 focus:border-orange-500 transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
            type="text"
            placeholder="Phone number"
            value={address.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress({ ...address, phoneNumber: e.target.value })
            }
          />

          <input
            className="px-2 py-2.5 focus:border-orange-500 transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
            type="text"
            placeholder="Zip code"
            value={address.zipcode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress({ ...address, zipcode: e.target.value })
            }
          />

          <textarea
            className="px-2 py-2.5 focus:border-orange-500 transition border border-foreground/30 rounded outline-none w-full text-foreground resize-none placeholder:text-foreground/50"
            rows={4}
            placeholder="Address (Area and Street)"
            value={address.area}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setAddress({ ...address, area: e.target.value })
            }
          />

          <div className="flex space-x-3">
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
              type="text"
              placeholder="City/District/Town"
              value={address.city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-foreground/30 rounded outline-none w-full text-foreground placeholder:text-foreground/50"
              type="text"
              placeholder="Province"
              value={address.province}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress({ ...address, province: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
        >
          Save address
        </button>
      </form>

      <Image
        className="md:mr-16 mt-16 md:mt-0"
        src={assets.my_location_image}
        alt="my_location_image"
      />
    </div>
  );
}
