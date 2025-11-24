import { create } from "zustand"

interface search {
    search: string
    setSearch: (search: string) => void
}

export const useSearchAdmin = create<search>((set) => ({
    search: '',
    setSearch: (search: string) => set({ search })
}))