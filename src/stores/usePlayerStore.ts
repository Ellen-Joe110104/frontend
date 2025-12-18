import { create } from "zustand";
import type { Song } from "@/types";

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;

    isShuffle: boolean;
    repeatMode: "OFF" | "ALL" | "ONE";
    originalQueue: Song[]; // Keep track of original order

    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    isShuffle: false,
    repeatMode: "OFF",
    originalQueue: [],

    initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            originalQueue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        })
    },
    playAlbum: (songs: Song[], startIndex = 0) => {
        if (songs.length === 0) return;

        const song = songs[startIndex];

        set({
            queue: songs,
            originalQueue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
            isShuffle: false,
            repeatMode: "OFF",
        })
    },
    setCurrentSong: (song: Song | null) => {
        if (!song) return;
        const songIndex = get().queue.findIndex((s) => s._id === song._id);
        set({
            currentSong: song,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
            isPlaying: true
        })
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;
        set({
            isPlaying: willStartPlaying
        });
    },

    toggleShuffle: () => {
        const { isShuffle, originalQueue, currentSong } = get();

        if (!isShuffle) {
            // Turning Shuffle ON
            const shuffled = [...originalQueue].sort(() => Math.random() - 0.5);
            const index = shuffled.findIndex((s) => s._id === currentSong?._id);
            set({
                isShuffle: true,
                queue: shuffled,
                currentIndex: index !== -1 ? index : 0,
            });
        } else {
            // Turning Shuffle OFF: Restore original order
            const index = originalQueue.findIndex((s) => s._id === currentSong?._id);
            set({
                isShuffle: false,
                queue: originalQueue,
                currentIndex: index !== -1 ? index : 0,
            });
        }
    },

    toggleRepeat: () => {
        const { repeatMode } = get();
        let newMode: "OFF" | "ALL" | "ONE" = "OFF";
        if (repeatMode === "OFF") newMode = "ALL";
        else if (repeatMode === "ALL") newMode = "ONE";
        else newMode = "OFF";

        set({ repeatMode: newMode });
    },

    playNext: () => {
        const { currentIndex, queue, repeatMode } = get()
        let nextIndex = currentIndex + 1

        // Handle repeat all
        if (repeatMode === "ALL" && nextIndex >= queue.length) {
            nextIndex = 0;
        }

        // if there is a next song, play it
        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex]
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            });
        } else {
            // no next song and not repeating
            set({
                isPlaying: false,
            });
        }
    },

    playPrevious: () => {
        const { currentIndex, queue, repeatMode } = get();
        let prevIndex = currentIndex - 1;

        // Handle repeat all (wrap around)
        if (repeatMode === "ALL" && prevIndex < 0) {
            prevIndex = queue.length - 1;
        }

        // there is a previous song
        if (prevIndex >= 0) {
            const prevSong = queue[prevIndex];
            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true,
            })
        } else {
            // no previous song
            set({
                isPlaying: false,
            })
        }
    }
}))