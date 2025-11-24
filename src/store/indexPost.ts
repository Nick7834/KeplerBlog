import { create } from "zustand"

interface index {
    indexPost: string
    setIndexPost: (indexPost: string) => void
}

export const useIndexPost = create<index>((set) => ({
    indexPost: '',
    setIndexPost: (indexPost: string) => set({ indexPost })
}))