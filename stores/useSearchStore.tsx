/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

type SearchStore = {
  searchQuery: any;
  setSearchQuery: (searchQuery: any) => void;
};

const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));


export default useSearchStore;
