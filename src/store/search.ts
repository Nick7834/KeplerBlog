import { create } from "zustand";

interface SearchStore {
    query: string;
    setQuery: (query: string) => void;
}

export const useSearchStore  = create<SearchStore>((set) => ({
    query: '',
    setQuery: (query: string) => set({ query }),
}))