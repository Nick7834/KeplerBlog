import { create } from "zustand";

interface userAvatar {
    avatarUser: string;
    userName: string;
    backgroundChat: string
    setUserName: (userName: string) => void
    setAvatarUser: (avatarUser: string) => void
    setBackgroundChat: (backgroundChat: string) => void
}

export const useUserAvatar = create<userAvatar>((set) => ({
    avatarUser: '',
    setAvatarUser: (avatarUser: string) => set({ avatarUser }),
    userName: '',
    setUserName: (userName: string) => set({ userName }),
    backgroundChat: '',
    setBackgroundChat: (backgroundChat: string) => set({ backgroundChat }),
}))