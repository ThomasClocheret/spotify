// src/App.tsx
import "./styles/App.css";

import React, { FC, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from './store/store';

import { showCreatePlaylist, showEditPlaylist, hideCreatePlaylist, hideEditPlaylist, hideAlert } from './appSlice';
import { authSelectors } from "./containers/auth/selectors";
import { logOut } from './containers/auth/slice';
import { Playlist } from "./types/spotify";

// Components
import Button from "./components/button/Button";
import Alert from "./components/alert/Alert";
import CreatePlaylist from "./containers/createPlaylist/CreatePlaylist";
import EditPlaylist from './containers/editPlaylist/EditPlaylist';
import PlaylistSelector from "./containers/selectPlaylist/PlaylistSelector";
import TrackList from './containers/selectPlaylist/TrackList';
import SearchBar from './containers/searchTracks/SearchBar';

import type { PlaylistTrack } from './types/spotify';

const App: FC = (): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);

  const isCreatePlaylistVisible = useSelector((state: RootState) => state.appSlice.showCreatePlaylist);
  const isEditPlaylistVisible = useSelector((state: RootState) => state.appSlice.showEditPlaylist);
  const showAlert = useSelector((state: RootState) => state.appSlice.showAlert);
  const alertMessage = useSelector((state: RootState) => state.appSlice.alertMessage);
  const alertType = useSelector((state: RootState) => state.appSlice.alertType);

  // Tracks from the selected playlist
  const selectedPlaylist = useSelector((state: RootState) => state.selectPlaylist.selectedPlaylist);
  const playlists = useSelector((state: RootState) => state.selectPlaylist.playlists as Playlist[]);
  const tracks = useSelector((state: RootState) => state.selectPlaylist.tracks as PlaylistTrack[]);

  // Find the currently selected playlist
  const selectedPlaylistObj = playlists.find((p) => p.id === selectedPlaylist);
  const playlistDescription = selectedPlaylistObj?.description || "";
  
  const handleAlertClose = () => {
    dispatch(hideAlert());
  };

  // Log out user
  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <>
      <div className="header-container">
        <div className="search">
          <SearchBar />
          <Button
            label="Search"
            onClick={() => console.log("Search clicked")}
          />
        </div>
        <div className="header-container-right">
          <Button
            label="Add new playlist"
            onClick={() => dispatch(showCreatePlaylist())}
          />
          <div className="account">
            <div className="account-profile">
              <img
                src={user?.userImage || "https://via.placeholder.com/33"}
                alt="profile"
              />
            </div>
            <div className="drop-down">
              <p>Account: {user?.userName || "Profile"}</p>
              <p onClick={handleLogOut}>Log out</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="playlist-select">
          <div className="playlist-select-left">
            <PlaylistSelector />
            <Button
              label="Edit playlist"
              onClick={() => dispatch(showEditPlaylist())}
            />
            {playlistDescription && <p>{playlistDescription}</p>}
          </div>
          <div className="filter-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h18v2H3V4zm3 7h12v2H6v-2zm4 5h4v2h-4v-2z"></path>
            </svg>
          </div>
        </div>

        <div className="track-list">
          <TrackList tracks={tracks} playlistId={selectedPlaylist!} />
        </div>
      </div>

      {isCreatePlaylistVisible && (
        <CreatePlaylist
          onCancel={() => dispatch(hideCreatePlaylist())}
        />
      )}

      {isEditPlaylistVisible && selectedPlaylistObj && (
        <EditPlaylist
          playlistId={selectedPlaylistObj.id}
          initialName={selectedPlaylistObj.name}
          initialDescription={playlistDescription}
          initialPublic={true}
          onCancel={() => dispatch(hideEditPlaylist())}
        />
      )}

      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={handleAlertClose}
        />
      )}
    </>
  );
};

export default App;