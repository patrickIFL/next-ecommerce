/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  region: string;
  province: string;
  city: string;
  area: string;
  zipcode: string;
}

interface AddressForm {
  fullName: string;
  phoneNumber: string;
  zipcode: string;
  area: string;
  city: string;
  province: string;
}

interface AddressForm {
  fullName: string;
  phoneNumber: string;
  zipcode: string;
  area: string;
  city: string;
  province: string;
}

function useAddressHook() {
  const { getToken } = useAuth();
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    phoneNumber: "",
    zipcode: "",
    area: "",
    city: "",
    province: "",
  });

  const { mutate: addAddress, isPending: addAddressLoading } = useMutation({
    mutationFn: async (address: AddressForm) => {
      const token = await getToken();
      const res = await fetch("/api/user/add-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      if (!res.ok) throw new Error("Failed to add address");
      return res.json();
    },

    onSuccess: (data) => {
      toast.success(data.message);
      setAddress({
        fullName: "",
        phoneNumber: "",
        zipcode: "",
        area: "",
        city: "",
        province: "",
      });
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const {
    data: addresses = [],
    refetch: refetchAddress,
    isRefetching: addressesLoading,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch addresses");
      }

      return data.addresses as Address[];
    },
  });

  return {
    addAddress,
    addAddressLoading,
    addresses,
    refetchAddress,
    addressesLoading,
    address,
    setAddress,
  };
}

export default useAddressHook;
