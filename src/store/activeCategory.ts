import { create } from "zustand";

interface activeCategoryType {
    active: string | null;
    setActive: (active: string | null) => void
}

export const useActiveCategory = create<activeCategoryType>((set) => ({
    active: null,
    setActive: (active: string | null) => set({ active })
}))