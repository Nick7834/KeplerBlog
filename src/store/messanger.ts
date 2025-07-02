import { create } from "zustand";

interface MessangerStore {
  openMessager: boolean;
  setOpenMessager: (open: boolean) => void;
}

interface ChatStore {
  currentChatId: string;
  setCurrentChatId: (chatId: string) => void;
}

interface MenuStore {
  menu: boolean;
  setMenu: (menu: boolean) => void;
}

interface SettingsStore {
  settings: boolean;
  setSettings: (settings: boolean) => void;
}

export const useMessangerStore = create<MessangerStore>((set) => ({
  openMessager: false,
  setOpenMessager: (openMessager: boolean) => set({ openMessager }),
}));

export const useMessangerIdChat = create<ChatStore>((set) => ({
  currentChatId: "",
  setCurrentChatId: (currentChatId: string) => set({ currentChatId }),
}));

export const useMessangerMenu = create<MenuStore>((set) => ({
  menu: false,
  setMenu: (menu: boolean) => set({ menu }),
}));

export const useMessangerSettings = create<SettingsStore>((set) => ({
  settings: false,
  setSettings: (settings: boolean) => set({ settings }),
}));
