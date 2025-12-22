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
            const response = await axiosInstance.get("/admin/check"); //Kiểm tra admin permission
            set({ isAdmin: response.data.admin }); //Cập nhật state admin
        } catch (error: any) {
            set({ isAdmin: false, error: null })
        } finally {
            set({ isLoading: false });
        }

    },
    reset: () => {
        set({ isAdmin: false, isLoading: false, error: null });
    }
}))