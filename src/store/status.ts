import { create } from "zustand";

interface statusLike {
    statusLike: boolean
    setStatusLike: (open: boolean) => void
}

interface statusFollow {
    statusFollow: boolean
    setStatusFollow: (open: boolean) => void
}

export const useStatusLike  = create<statusLike>((set) => ({
    statusLike: false,
    setStatusLike: (statusLike: boolean) => set({ statusLike }),
}))

export const useStatusFollow  = create<statusFollow>((set) => ({
    statusFollow: false,
    setStatusFollow: (statusFollow: boolean) => set({ statusFollow }),
}))