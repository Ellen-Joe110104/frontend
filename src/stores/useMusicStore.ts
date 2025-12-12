import { create } from "zustand";
import { axiosInstance } from "@/lib/axios.ts";
import type { Album, Song } from "@/types";


interface MusicStore {
    albums: Album[];
    songs: Song[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    featuredSongs: Song[];

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    trendingSongs: [],
    featuredSongs: [],

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/albums");
            set({ albums: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbumById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const respone = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: respone.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const respone = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: respone.data })
        } catch (error: any) {
            set({ error: error.response.data.message })
        } finally {
            set({ isLoading: false })
        }
    },
    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const respone = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: respone.data })
        } catch (error: any) {
            set({ error: error.response.data.message })
        } finally {
            set({ isLoading: false })
        }
    },
    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const respone = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: respone.data })
        } catch (error: any) {
            set({ error: error.response.data.message })
        } finally {
            set({ isLoading: false })
        }
    },

}));




