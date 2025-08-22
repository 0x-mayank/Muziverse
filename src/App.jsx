import React, { useState, useEffect, useCallback } from 'react';
// --- FIX: Using a valid icon (FaSyncAlt) from the 'fa' library to resolve the error ---
import { FaSpotify, FaSearch, FaSyncAlt } from 'react-icons/fa';

// --- Configuration & Constants ---
const BACKEND_URL = 'https://muziverse-backend.onrender.com';
const ENGLISH_GENRES = [
    'Pop', 'Hip-Hop', 'Rock', 'Indie', 'Electronic', 'Dance', 'Phonk', 'R&B', 'Metal', 'Jazz', 'Country', 'Acoustic'
];
const HINDI_GENRES = [
    'Bollywood', 'Desi-Hip-Hop', 'Indie', 'Punjabi',
    'Ghazal', 'Classical', 'Desi-Pop', 'Haryanvi','Hindi-Oldies'
];

// --- SVG Illustrations ---
const InitialStateIcon = () => (
    <div className="text-center">
        {/* --- NEW, CLEANER ICON --- */}
        <svg className="w-40 h-40 text-gray-800 mx-auto mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10v4" />
            <path d="M7 6v12" />
            <path d="M11 2v20" />
            <path d="M15 6v12" />
            <path d="M19 10v4" />
        </svg>
        <h2 className="text-2xl font-bold text-white mb-2">Find Your Vibe</h2>
        <p className="text-gray-400">Use the controls on the left to start discovering new music.</p>
    </div>
);

// --- UI Components ---

const ControlPanel = ({ language, setLanguage, genres, selectedGenre, setSelectedGenre, onSearch, isLoading }) => (
    <aside className="w-full md:w-1/4 lg:w-1/5 bg-black/20 p-6 rounded-xl flex flex-col gap-8">
        {/* --- NEW: Mobile Header --- */}
        <div className="text-center md:hidden">
            <h1 className="text-3xl font-bold text-white">Muziverse</h1>
            <p className="text-gray-400 text-sm">Your personalized genre picks</p>
        </div>
        <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Language</h2>
            <div className="bg-gray-800 rounded-full p-1 flex items-center border border-gray-700">
                <button onClick={() => setLanguage('english')} className={`lang-btn w-1/2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${language === 'english' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>English</button>
                <button onClick={() => setLanguage('hindi')} className={`lang-btn w-1/2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${language === 'hindi' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Hindi</button>
            </div>
        </div>
        <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Genre</h2>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white text-md rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 select-arrow">
                {genres.map(genre => (
                    <option key={genre} value={genre.toLowerCase()}>{genre}</option>
                ))}
            </select>
        </div>
        <button onClick={onSearch} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed">
            <FaSearch size={16} />
            <span>Search</span>
        </button>
    </aside>
);

const SongCard = ({ track }) => {
    const placeholderImage = `https://placehold.co/300x300/121212/ffffff?text=${encodeURIComponent(track.album)}`;
    return (
        <div className="bg-black/20 rounded-lg overflow-hidden shadow-lg card-hover-effect animate-fade-in group relative">
            <img src={track.image || placeholderImage} alt={`Album art for ${track.album}`} className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.src = placeholderImage; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-bold text-lg text-white truncate" title={track.name}>{track.name}</h3>
                <p className="text-gray-300 text-sm truncate" title={track.artist}>{track.artist}</p>
            </div>
            <a href={track.spotify_url} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 bg-purple-600 text-white p-3 rounded-full transform transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110">
                <FaSpotify size={20} />
            </a>
        </div>
    );
};

const MessageDisplay = ({ message, type = 'info' }) => {
    const colorClass = type === 'error' ? 'text-red-400' : 'text-gray-400';
    return (
        <div className="text-center flex-grow flex items-center justify-center">
            <p className={`${colorClass} text-xl`}>{message}</p>
        </div>
    );
};

const Loader = () => (
    <div className="text-center flex-grow flex items-center justify-center">
        <div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Finding some tunes...</p>
        </div>
    </div>
);

const RefreshButton = ({ onRefresh, isLoading }) => (
     <div className="text-center mt-8">
        <button onClick={onRefresh} disabled={isLoading} className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed mx-auto">
            <FaSyncAlt size={18} className={isLoading ? 'animate-spin' : ''} />
            Get New Songs
        </button>
    </div>
);

// --- Main App Component ---
export default function App() {
    const [language, setLanguage] = useState('english');
    const [genres, setGenres] = useState(ENGLISH_GENRES.sort());
    const [selectedGenre, setSelectedGenre] = useState(ENGLISH_GENRES.sort()[0].toLowerCase());
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const newGenres = (language === 'english' ? ENGLISH_GENRES : HINDI_GENRES).sort();
        setGenres(newGenres);
        setSelectedGenre(newGenres[0].toLowerCase());
    }, [language]);

    const fetchSongs = useCallback(async (genre, lang) => {
        setIsLoading(true);
        setError(null);
        if (!hasSearched) setSongs([]);
        
        try {
            const response = await fetch(`${BACKEND_URL}/search?genre=${genre}&language=${lang}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            const tracks = await response.json();
            setSongs(tracks);
            if (!hasSearched) setHasSearched(true);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(`Could not fetch songs. ${err.message}. Is the backend server running?`);
        } finally {
            setIsLoading(false);
        }
    }, [hasSearched]);

    const handleSearch = () => {
        fetchSongs(selectedGenre, language);
    };

    const handleRefresh = () => {
        if (selectedGenre) {
            fetchSongs(selectedGenre, language);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans flex flex-col md:flex-row gap-8 p-4 sm:p-6 md:p-8">
            <style>{`
                .select-arrow {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.75rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                .card-hover-effect {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .card-hover-effect:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-in-out forwards;
                }
            `}</style>
            
            <ControlPanel
                language={language}
                setLanguage={setLanguage}
                genres={genres}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                onSearch={handleSearch}
                isLoading={isLoading}
            />

            <main className="flex-grow flex flex-col">
                {/* --- UPDATED: Desktop Header --- */}
                <header className="text-left mb-6 hidden md:block">
                    <h1 className="text-3xl font-bold text-white">Muziverse</h1>
                    <p className="text-gray-400">Your personalized genre picks</p>
                </header>
                
                {isLoading && <Loader />}
                {error && <MessageDisplay message={error} type="error" />}
                {!isLoading && !error && songs.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {songs.map(track => <SongCard key={track.id} track={track} />)}
                        </div>
                        <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
                    </>
                )}
                {!isLoading && !error && songs.length === 0 && (
                     <div className="flex-grow flex items-center justify-center">
                        {hasSearched ? 
                            <MessageDisplay message="No songs found. Try another genre!" /> : 
                            <InitialStateIcon />
                        }
                     </div>
                )}
            </main>
        </div>
    );
}
