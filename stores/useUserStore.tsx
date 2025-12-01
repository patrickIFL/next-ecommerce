import { create } from "zustand";

type UserStore = {
  isSeller: boolean;
  setIsSeller: (isSeller: boolean) => void;
};

const useUserStore = create<UserStore>((set) => ({
  isSeller: false,                   // default value
  setIsSeller: (isSeller:boolean) => set({ isSeller }),
}));

export default useUserStore;
