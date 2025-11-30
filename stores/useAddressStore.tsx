import { create } from "zustand";

interface AddressStore {
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
}

const useAddressStore = create<AddressStore>((set) => ({
  selectedAddressId: null,
  setSelectedAddressId: (id) => set({ selectedAddressId: id })
}));

export default useAddressStore;
