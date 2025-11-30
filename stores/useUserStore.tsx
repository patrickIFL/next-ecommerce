import { create } from "zustand";

const useUserStore = create((set) => ({
  isSeller,
  setIsSeller: (isSeller) => set({ isSeller }),;
}))

export default useUserStore