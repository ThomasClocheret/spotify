import "./playlistSelector.css";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylists, selectPlaylist } from "./slice";
import { authSelectors } from "../auth/selectors";
import { RootState } from "../../store/store";
import { Playlist } from "../../types/spotify";

const PlaylistSelector: React.FC = () => {
    const dispatch = useDispatch();
    const playlists = useSelector((state: RootState) => state.selectPlaylist.playlists as Playlist[]);
    const selectedPlaylist = useSelector((state: RootState) => state.selectPlaylist.selectedPlaylist);
    const selectedPlaylistObj = playlists.find(p => p.id === selectedPlaylist);

    // Get accessToken and userId from the auth state
    const accessToken = useSelector(authSelectors.getAccessToken);
    const user = useSelector(authSelectors.getUser);
    const userId = user?.userId;

    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        if (accessToken && userId) {
            dispatch(fetchPlaylists());
        }
    }, [dispatch, accessToken, userId]);

    const handleSelect = (playlistId: string) => {
        dispatch(selectPlaylist(playlistId));
        setDropdownVisible(false);
    };

    const toggleDropdown = () => {
        setDropdownVisible((prevVisible) => !prevVisible);
    };

    return (
        <div className="playlist-selector-container" onMouseOver={toggleDropdown} onMouseOut={toggleDropdown}>
            <div className="playlist-selector">
                {/* Selected Playlist */}
                {selectedPlaylistObj ? (
                    <>
                        <img
                            src={selectedPlaylistObj.images?.[0]?.url || "https://via.placeholder.com/32"}
                            alt={selectedPlaylistObj.name}
                        />
                        <p>{selectedPlaylistObj.name || "Select a Playlist"}</p>
                    </>
                ) : (
                    <>
                        <img src="https://via.placeholder.com/32" alt="Default playlist" />
                        <p>Select a Playlist</p>
                    </>
                )}
                <svg className="chevron-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7.41 8.42L12 13l4.59-4.58L18 10l-6 6-6-6z"></path>
                </svg>
            </div>

            {dropdownVisible && (
                <div className="playlist-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-list">
                        {playlists.length > 0 ? (
                            playlists.map((playlist) => (
                                <div
                                    key={playlist.id}
                                    className={`playlist-item ${selectedPlaylist === playlist.id ? "selected" : ""}`}
                                    onClick={() => handleSelect(playlist.id)}
                                >
                                    <img
                                        src={playlist.images?.[0]?.url || "https://via.placeholder.com/32"}
                                        alt={playlist.name}
                                    />
                                    <p>{playlist.name}</p>
                                </div>
                            ))
                        ) : (
                            <p>No playlists available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistSelector;