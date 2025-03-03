import { create } from "zustand";

interface userAvatart {
    avatarUser: string;
    userName: string;
    setUserName: (userName: string) => void
    setAvatarUser: (avatarUser: string) => void
}

export const useUserAvatar = create<userAvatart>((set) => ({
    avatarUser: '',
    setAvatarUser: (avatarUser: string) => set({ avatarUser }),
    userName: '',
    setUserName: (userName: string) => set({ userName }),
}))