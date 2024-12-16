import { create } from "zustand";

interface LogInStore {
    open: boolean
    setOpen: (open: boolean) => void
}

export const useLogInStore  = create<LogInStore>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
}))