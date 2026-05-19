import { create } from "zustand";

interface settingsMessage {
    backgroundColorMessage: string;
    textColor: string;
    fontSize: number;
    radiusSize: number;
    blur: boolean;
    setBackgroundColorMessage: (backgroundColorMessage: string) => void;
    setTextColor: (textColor: string) => void;
    setFontSize: (fontSize: number) => void;
    setRadiusSize: (radiusSize: number) => void;
    setBlur: (blur: boolean) => void;
}

export const useSettingsMessage = create<settingsMessage >((set) => ({
   backgroundColorMessage: "#7391d5",
   textColor: "#ebebeb",
   fontSize: 14,
   radiusSize: 12,
   blur: false,
   setBackgroundColorMessage: (backgroundColorMessage) => set({ backgroundColorMessage }),
   setTextColor: (textColor) => set({ textColor }),
   setFontSize: (fontSize) => set({ fontSize }),
   setRadiusSize: (radiusSize) => set({ radiusSize }),
   setBlur: (blur) => set({ blur }),
}))