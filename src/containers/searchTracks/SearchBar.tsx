// src/containers/searchTracks/SearchBar.tsx

import "./searchTrack.css";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSearchTerm, clearSearchResults } from "./slice";
import { addTrackRequest, removeTrackRequest } from '../editPlaylist/slice';
import { fetchPlaylistTracks } from '../selectPlaylist/slice';
import { displayAlert } from '../../appSlice';
import { TrackObject, PlaylistTrack } from '../../types/spotify';
import { RootState } from "../../store/store";

const SearchBar: React.FC = () => {
    const dispatch = useDispatch();

    // Selectors to get state from Redux store
    const searchTerm = useSelector((state: RootState) => state.searchTrack.searchTerm);
    const searchResults = useSelector((state: RootState) => state.searchTrack.searchResults);
    const selectedPlaylistId = useSelector((state: RootState) => state.selectPlaylist.selectedPlaylist);
    const loading = useSelector((state: RootState) => state.searchTrack.loading);
    const error = useSelector((state: RootState) => state.searchTrack.error);
    const playlistTracks = useSelector((state: RootState) => state.selectPlaylist.tracks as PlaylistTrack[]);

    // Local state to manage visibility of search results
    const [showResults, setShowResults] = useState(false);
    const [addingTrackIds, setAddingTrackIds] = useState<string[]>([]);
    const [removingTrackIds, setRemovingTrackIds] = useState<string[]>([]);

    // Ref for the search bar container
    const searchBarRef = useRef<HTMLDivElement>(null);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(e.target.value));
        if (e.target.value.length > 0) {
            setShowResults(true);
        } else {
            dispatch(clearSearchResults());
            setShowResults(false);
        }
    };

    // Handle clicking on a search result
    const handleResultClick = (trackId: string) => {
        console.log("Track clicked:", trackId);
        dispatch(clearSearchResults());
        setShowResults(false);
    };

    // Handle clicking on the add/remove button
    const handleAddClick = (e: React.MouseEvent<HTMLDivElement>, track: TrackObject) => {
        e.stopPropagation();
        if (!selectedPlaylistId) {
            dispatch(displayAlert({ message: "No playlist selected.", type: "error" }));
            return;
        }
    
        const isCurrentlyAdded = playlistTracks.some(pt => pt.track.id === track.id);
        const isAdding = addingTrackIds.includes(track.id);
        const isRemoving = removingTrackIds.includes(track.id);
        const isAdded = (isCurrentlyAdded || isAdding) && !isRemoving;
    
        if (isAdded) {
            if (isRemoving) {
                // Cancel remove operation
                setRemovingTrackIds(removingTrackIds.filter(id => id !== track.id));
            } else {
                // Proceed to remove
                setRemovingTrackIds([...removingTrackIds, track.id]);
                dispatch(removeTrackRequest({ playlistId: selectedPlaylistId, trackUri: track.uri }));
            }
        } else {
            if (isAdding) {
                // Cancel add operation
                setAddingTrackIds(addingTrackIds.filter(id => id !== track.id));
            } else {
                // Proceed to add
                setAddingTrackIds([...addingTrackIds, track.id]);
                dispatch(addTrackRequest({ playlistId: selectedPlaylistId, trackUri: track.uri }));
            }
        }
    };    

    useEffect(() => {
        setAddingTrackIds((prevAdding) =>
            prevAdding.filter((id) => !playlistTracks.some((pt) => pt.track.id === id))
        );
        setRemovingTrackIds((prevRemoving) =>
            prevRemoving.filter((id) => playlistTracks.some((pt) => pt.track.id === id))
        );
    }, [playlistTracks]);
    

    // Click outside handler to hide search results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef]);


    // Fetch playlist tracks when search results are hidden
    useEffect(() => {
        if (!showResults && selectedPlaylistId) {
            // Dispatch action to refetch playlist tracks
            dispatch(fetchPlaylistTracks(selectedPlaylistId));
        }
    }, [showResults, selectedPlaylistId, dispatch]);

    return (
        <div className="search-bar-container" ref={searchBarRef}>
            <div className="search-bar">
                <div className="search-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"></path>
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search for a track"
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={() => {
                        if (searchTerm.length > 0) setShowResults(true);
                    }}
                />
            </div>
            {showResults && (
                <div className="search-results">
                    {loading && <div className="loading">Loading...</div>}
                    {error && <div className="error">{error}</div>}
                    {!loading && !error && searchResults.length === 0 && (
                        <div className="no-results">No tracks found</div>
                    )}
                    {!loading && !error && searchResults.length > 0 && (
                        <ul>
                            {searchResults.map((track) => {
                                const isCurrentlyAdded = playlistTracks.some(pt => pt.track.id === track.id);
                                const isAdding = addingTrackIds.includes(track.id);
                                const isRemoving = removingTrackIds.includes(track.id);
                                const isAdded = (isCurrentlyAdded && !isRemoving) || isAdding;
                                return (
                                    <li
                                        key={track.id}
                                        className="track-item"
                                        onClick={() => handleResultClick(track.id)}
                                    >
                                        <img
                                            src={track.album.images[2]?.url || "https://via.placeholder.com/64"}
                                            alt={track.name}
                                            className="track-image"
                                        />
                                        <div className="track-info">
                                            <p className="track-name">{track.name}</p>
                                            <p className="track-artist">
                                                {track.artists.map((artist) => artist.name).join(", ")}
                                            </p>
                                        </div>
                                        <div
                                            className={`add-button ${isAdded ? "added" : ""}`}
                                            onClick={(e) => handleAddClick(e, track)}
                                            aria-label={isAdded ? "Remove from Playlist" : "Add to Playlist"}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    handleAddClick(e as any, track);
                                                }
                                            }}
                                        >
                                            {!isAdded ? (
                                                //Plus Icon
                                                <svg
                                                    className="plus-icon"
                                                    data-encore-id="icon"
                                                    role="img"
                                                    aria-hidden="true"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                                                    <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
                                                </svg>
                                            ) : (
                                                // Checkmark Icon
                                                <svg
                                                    className="check-icon"
                                                    data-encore-id="icon"
                                                    role="img"
                                                    aria-hidden="true"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm16.398-2.38a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z"></path>
                                                </svg>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );

};

export default SearchBar;