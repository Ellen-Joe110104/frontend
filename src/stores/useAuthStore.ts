import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const respone = await axiosInstance.get("/admin/check");
            set({ isAdmin: respone.data.admin });
        } catch (error: any) {
            set({ isAdmin: false, error: error.respone.data.message })
        } finally {
            set({ isLoading: false });
        }

    },
    reset: () => {
        set({ isAdmin: false, isLoading: false, error: null });
    }
}))