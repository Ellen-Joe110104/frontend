import { create } from "zustand";
import { axiosInstance } from "@/lib/axios.ts";
import type { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";


interface MusicStore {
    albums: Album[];
    songs: Song[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    featuredSongs: Song[];
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
    search: (query: string) => Promise<void>;
    searchResults: { songs: Song[], albums: Album[] };
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
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0
    },
    searchResults: {
        songs: [],
        albums: []
    },

    deleteSong: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/songs/${id}`);

            set((state) => ({
                songs: state.songs.filter((song) => song._id !== id),
            }));
            toast.success("Song deleted successfully");
        } catch (error: any) {
            console.log("Error in deleteSong", error);
            toast.error("Error deleting song");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAlbum: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/albums/${id}`);
            set((state) => ({
                albums: state.albums.filter((album) => album._id !== id),
                songs: state.songs.map((song) =>
                    song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
                ),
            }));
            toast.success("Album deleted successfully");
        } catch (error: any) {
            toast.error("Failed to delete album: " + error.message);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/songs");
            set({ songs: response.data });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/stats");
            set({ stats: response.data });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

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

    search: async (query) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/songs/search?query=${query}`);
            set({ searchResults: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));




