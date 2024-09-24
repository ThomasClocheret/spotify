import './styles/App.css';

import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../src/store/store';

import { authSelectors } from "./containers/auth/selectors";
import { toggleCreatePlaylist, displayAlert, hideAlert } from './appSlice';
import { logOut } from './containers/auth/slice';

// Components
import Button from "./components/button/Button";
import Alert from "./components/alert/Alert";
import CreatePlaylist from "./containers/createPlaylist/CreatePlaylistComponent";
import PlaylistSelector from "./containers/selectPlaylist/PlaylistSelector";
import TrackList from './containers/selectPlaylist/TrackList';
import SearchBar from './containers/searchTracks/SearchBar';

import type { PlaylistTrack } from './types/spotify';

const App: FC = (): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);

  const showCreatePlaylist = useSelector((state: RootState) => state.appSlice.showCreatePlaylist);
  const showAlert = useSelector((state: RootState) => state.appSlice.showAlert);
  const alertMessage = useSelector((state: RootState) => state.appSlice.alertMessage);

  // Tracks from the selected playlist
  const selectedPlaylist = useSelector((state: RootState) => state.selectPlaylist.selectedPlaylist);
  const tracks = useSelector((state: RootState) => state.selectPlaylist.tracks as PlaylistTrack[]);

  // Access error from Redux state
  const playlistError = useSelector((state: RootState) => state.createPlaylist.error);

  useEffect(() => {
    if (playlistError) {
      dispatch(displayAlert(playlistError));
    }
  }, [playlistError, dispatch]);

  const handleAlertClose = () => {
    dispatch(hideAlert());
  };

  // Log out user
  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <>
      <div className='header-container'>
        <div className='search'>
          <SearchBar />
          <Button label="Search" onClick={() => console.log("Search clicked")} />
        </div>
        <div className='header-container-right'>
          {/* Add a dark/light button switch */}
          <Button label="Add new playlist" onClick={() => dispatch(toggleCreatePlaylist())} />
          <div className='account'>
            <div className="account-profile">
              <img src={user?.userImage || "https://via.placeholder.com/33"} alt="profile" />
            </div>
            <div className='drop-down'>
              <p>Account: {user?.userName || "Profile"}</p>
              <p onClick={handleLogOut}>Log out</p>
            </div>
          </div>
        </div>
        
      </div>

      <div className='content-container'>
        <div className="playlist-select">
          <div className="playlist-select-left">
            <PlaylistSelector />
            <Button label="Edit playlist" onClick={() => console.log("Edit playlist clicked")} />
            <p>set playlist description</p>
          </div>
          <div className="filter-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h18v2H3V4zm3 7h12v2H6v-2zm4 5h4v2h-4v-2z"></path>
            </svg>
          </div>
        </div>

        <div className="track-list">
          <TrackList
            tracks={tracks}
            playlistId={selectedPlaylist!}
          />
        </div>
      </div>

      {showCreatePlaylist && (<CreatePlaylist key={Math.random()} onCancel={() => dispatch(toggleCreatePlaylist())} />)}

      {showAlert && (<Alert message={alertMessage} onClose={handleAlertClose} />)}
    </>
  );
};

export default App;