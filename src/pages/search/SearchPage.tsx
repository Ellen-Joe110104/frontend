import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { Play, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { usePlayerStore } from "@/stores/usePlayerStore";

const SearchPage = () => {
    const { search, searchResults, isLoading } = useMusicStore();
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                search(searchTerm);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, search]);

    const handlePlaySong = (song: any) => {
        if (currentSong?._id === song._id) {
            togglePlay();
        } else {
            playAlbum([song], 0);
        }
    };


    return (
        <div className='h-full w-full overflow-hidden bg-black text-white'>
            <Topbar />

            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6'>
                    <h1 className='text-2xl font-bold mb-6'>Search</h1>

                    <div className='relative max-w-md w-full mb-8'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-5' />
                        <Input
                            className='pl-10 bg-zinc-800 border-none text-white focus:ring-0 focus:ring-offset-0'
                            placeholder='Search for songs, albums...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isLoading && <p className="text-zinc-400">Searching...</p>}

                    {!isLoading && searchResults.songs.length === 0 && searchResults.albums.length === 0 && searchTerm && (
                        <p className="text-zinc-400">No results found for "{searchTerm}"</p>
                    )}


                    {(searchResults.songs.length > 0 || searchResults.albums.length > 0) && (
                        <div className="space-y-8">
                            {/* Songs Section */}
                            {searchResults.songs.length > 0 && (
                                <div>
                                    <h2 className='text-xl font-semibold mb-4'>Songs</h2>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                        {searchResults.songs.map((song) => (
                                            <div
                                                key={song._id}
                                                className='group relative flex items-center gap-4 bg-zinc-800/50 hover:bg-zinc-800 transition-colors rounded-md overflow-hidden pr-4'
                                            >
                                                <div className='relative w-16 h-16'>
                                                    <img
                                                        src={song.imageUrl}
                                                        alt={song.title}
                                                        className='object-cover w-full h-full'
                                                    />
                                                    <div
                                                        className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${currentSong?._id === song._id ? "opacity-100" : ""
                                                            }`}
                                                    >
                                                        <button
                                                            onClick={() => handlePlaySong(song)}
                                                            className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition-colors'
                                                        >
                                                            {currentSong?._id === song._id && isPlaying ? (
                                                                <span className="w-2.5 h-2.5 bg-black block" /> // Pause Icon substitute
                                                            ) : (
                                                                <Play className='w-4 h-4 text-black fill-black ml-0.5' />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0 py-2">
                                                    <h3 className='font-medium text-white truncate'>{song.title}</h3>
                                                    <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Albums Section */}
                            {searchResults.albums.length > 0 && (
                                <div>
                                    <h2 className='text-xl font-semibold mb-4'>Albums</h2>
                                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                                        {searchResults.albums.map((album) => (
                                            <Link
                                                key={album._id}
                                                to={`/albums/${album._id}`}
                                                className='p-4 hover:bg-zinc-800/50 rounded-md transition-colors group cursor-pointer'
                                            >
                                                <div className='relative mb-4'>
                                                    <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                                                        <img
                                                            src={album.imageUrl}
                                                            alt={album.title}
                                                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className='font-medium truncate'>{album.title}</h3>
                                                <p className='text-sm text-zinc-400 truncate'>{album.artist}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                </div>
            </ScrollArea>
        </div>
    );
};

export default SearchPage;
