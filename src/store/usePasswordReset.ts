import { create } from "zustand";

interface PasswordResetState {
    step: "email" | "code" | "newPassword";
    email: string;
    setEmail: (email: string) => void;
    nextStep: () => void;
    reset: () => void;
}

export const usePasswordReset = create<PasswordResetState>((set) => ({
    step: "email",
    email: "",
    setEmail: (email) => set({ email }),
    nextStep: () => set((state) => ({ step: state.step === "email" ? "code" : "newPassword" })),
    reset: () => set({ step: "email", email: "" }),
}));