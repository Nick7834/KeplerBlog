import { create } from "zustand";

interface OnlineState {
  onlineUsers: Record<string, boolean>;
  lastActiveMap: Record<string, number>;
  setOnlineUsers: (users: Record<string, boolean>) => void;
  setLastActiveMap: (map: Record<string, number>) => void;
}

export const useOnlineStore = create<OnlineState>((set) => ({
  onlineUsers: {},
  lastActiveMap: {},
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setLastActiveMap: (map) => set({ lastActiveMap: map }),
}));