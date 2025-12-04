import { create } from "zustand";

type SearchStore = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
};

const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));


export default useSearchStore;
