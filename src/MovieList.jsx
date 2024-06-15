import { useState, useEffect } from 'react';
import MovieCard from './MovieCard.jsx';
import { BiAlignLeft } from "react-icons/bi";
import { IoExitOutline } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import './MovieList.css';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieRuntime, setMovieRuntime] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const [sortOption, setSortOption] = useState('popularity.desc');
    const [favoriteList, setFavoriteList] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');
    const [sidebar, setSidebar] = useState(false);

    const fetchData = async () => {
        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortOption}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            if (page > 1) {
                setMovies(old => [
                    ...old,
                    ...data.results
                ]);
            } else {
                setMovies(data.results)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const searchData = async () => {
        if (searchQuery !== '') {
            setIsSearching(true);
            try {
                const apiKey = import.meta.env.VITE_API_KEY;
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&sort_by=${sortOption}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setSearchResults(data.results)
            } catch (error) {
                console.error(error);
            }
        } else {
            setPage(1);
            setIsSearching(false);
        }
    }

    const fetchGenreData = async (genreId) => {
        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=${sortOption}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setSelectedGenre(data.results)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchRuntime = async (id) => {
        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Failed to fetch runtime');
            }
            const data = await response.json();
            setMovieRuntime(data.runtime);
        } catch (error) {
            console.error(error);
            setMovieRuntime(null);
        }
    }

    const videoData = async (id) => {
        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }

    useEffect(() => {
        fetchData();
    }, [page, sortOption])

    useEffect(() => {
        searchData();
    }, [searchQuery, sortOption])

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    }

    const openModal = async (id) => {
        const movie = (isSearching ? searchResults : (isFiltering ? selectedGenre : movies)).find(movie => movie.id == id);
        setSelectedMovie(movie);
        console.log(selectedMovie);

        const videos = await videoData(id);
        const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        } else {
            setTrailerUrl('');
        }

        await fetchRuntime(id);
    }

    const closeModal = () => {
        setSelectedMovie(null);
        setTrailerUrl('');
        setMovieRuntime(null);
    }

    const GENRE_TO_ID = {
        'Action': 28,
        'Adventure': 12,
        'Animation': 16,
        'Comedy': 35,
        'Crime': 80,
        'Documentary': 99,
        'Drama': 18,
        'Family': 10751,
        'Fantasy': 14,
        'History': 36,
        'Horror': 27,
        'Music': 10402,
        'Mystery': 9648,
        'Romance': 10749,
        'Science Fiction': 878,
        'TV Movie': 10770,
        'Thriller': 53,
        'War': 10752,
        'Western': 37
    }

    const handleGenreChange = (event) => {
        const value = event.target.value;
        if (value === "Select") {
            setIsFiltering(false);
            setSortOption('popularity.desc');
        } else if (value === 'release_date.desc' || value === 'vote_average.desc') {
            setIsFiltering(false);
            setSortOption(value);
        } else {
            setIsFiltering(true);
            const id = GENRE_TO_ID[value];
            fetchGenreData(id);
        }
    }

    const handleFavoriteList = (id) => {
        const movie = (isSearching ? searchResults : (isFiltering ? selectedGenre : movies)).find(movie => movie.id == id);
        if (!favoriteList.find(favMovie => favMovie.id === id)) {
            setFavoriteList(old => [
                ...old,
                movie,
            ])
        }
    }

    const handleWatchlist = (id) => {
        const movie = (isSearching ? searchResults : (isFiltering ? selectedGenre : movies)).find(movie => movie.id == id);
        if (!watchlist.find(watchMovie => watchMovie.id === id)) {
            setWatchlist(old => [
                ...old,
                movie,
            ])
        }
    }

    const sidebarOff = () => {
        setSidebar(false);
        document.body.classList.remove('no-scroll');
    }

    const sidebarOn = () => {
        setSidebar(true);
        document.body.classList.add('no-scroll');
    }

    return (
        <div className="overlay">
            <div className="header-bottom">
                <BiAlignLeft className="icon" onClick={sidebarOn}/>
                <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." />
                <select id="genreDropdown" onChange={handleGenreChange}>
                    <option value="Select">Select</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Crime">Crime</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Drama">Drama</option>
                    <option value="Family">Family</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="History">History</option>
                    <option value="Horror">Horror</option>
                    <option value="Music">Music</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="TV Movie">TV Movie</option>
                    <option value="Thriller">Thriller</option>
                    <option value="War">War</option>
                    <option value="Western">Western</option>
                    <option value="release_date.desc">Sort by Release Date</option>
                    <option value="vote_average.desc">Sort by Vote Average</option>
                </select>
            </div>

            <div className={sidebar ? "sidebar-on" : "sidebar-off"}>
                {favoriteList && (
                    <div>
                        <div className="sidebar-header">
                            <IoExitOutline className="icon" onClick={sidebarOff} />
                            <p className="sidebar-title">Favorite's List:</p>
                        </div>

                        {favoriteList.map(movie => {
                            return (
                                <div key={movie.id} className="sidebar-list">
                                    <img className="sidebar-image" onClick={() => {openModal(movie.id)}} src={movie.poster_path == null ? "thonk.jpg" : "https://image.tmdb.org/t/p/w1280" + movie.poster_path}/>
                                    <p>{movie.title}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
                {watchlist && (
                    <div>
                        <div className="sidebar-header">
                            <p className="sidebar-title">Watched List:</p>
                        </div>

                        {watchlist.map(movie => {
                            return (
                                <div key={movie.id} className="sidebar-list">
                                    <img className="sidebar-image" onClick={() => {openModal(movie.id)}} src={movie.poster_path == null ? "thonk.jpg" : "https://image.tmdb.org/t/p/w1280" + movie.poster_path}/>
                                    <p>{movie.title}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="movie-list">
                {(isSearching ? searchResults : (isFiltering ? selectedGenre : movies)).map(movie => {
                    const isFavorited = favoriteList.find(favMovie => favMovie.id === movie.id);
                    const isWatched = watchlist.find(watchMovie => watchMovie.id === movie.id);

                    return (
                        <MovieCard
                            key={movie.id}
                            image={movie.poster_path == null ? "thonk.jpg" : "https://image.tmdb.org/t/p/w1280" + movie.poster_path}
                            title={movie.title}
                            rating={Math.round(Number(movie.vote_average) * 10) / 10}
                            open={() => openModal(movie.id)}
                            favorite={() => handleFavoriteList(movie.id)}
                            favorited={isFavorited ? "❤️" : "🖤"}
                            watch={() => handleWatchlist(movie.id)}
                            watched={isWatched ? "✅" : "🎬"}
                        />
                    )
                })}
            </div>

            <div>
                <button onClick={loadMore}>Load More</button>
            </div>

            {selectedMovie && (
                <div className="modal">
                    <div className="modal-close" onClick={closeModal}><IoMdCloseCircle /></div>
                    <div className="modal-main">
                        <div className="modal-left">
                            <img className="modal-image" src={selectedMovie.backdrop_path == null ? "thonk.jpg" : "https://image.tmdb.org/t/p/w1280" + selectedMovie.backdrop_path } alt="No movie image" />
                            <div>
                                <p className="modal-title">{selectedMovie.title}</p>
                                <p>Release Date: {selectedMovie.release_date}</p>
                                <p>Popularity Rating: {selectedMovie.popularity}</p>
                                {movieRuntime !== null && <p>Runtime: {movieRuntime} minutes</p>}
                            </div>
                        </div>
                        <div className="modal-right">
                            {trailerUrl && <iframe className="modal-trailer" src={trailerUrl}></iframe>}
                            <p className="modal-summary">Summary:</p>
                            <p>{selectedMovie.overview}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MovieList;
