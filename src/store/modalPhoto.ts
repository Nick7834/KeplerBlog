import { create } from "zustand";

interface modalPhoto {
    showModal: boolean,
    setShowModal: (showModal: boolean) => void,

    indexPhoto: number,
    setIndexPhoto: (indexPhoto: number) => void
}

export const buttonPohotoModal = create<modalPhoto>((set) => ({
    showModal: false,
    setShowModal: (showModal: boolean) => set({ showModal }),

    indexPhoto: 0,
    setIndexPhoto: (indexPhoto: number) => set({ indexPhoto }),
}))