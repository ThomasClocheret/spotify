import './styles/App.css';

import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../src/store/store';

//import { authSelectors } from "./containers/auth/selectors";
import { toggleCreatePlaylist, displayAlert, hideAlert } from './appSlice';

// Components
import Button from "./components/button/Button";
import Alert from "./components/alert/Alert";
import CreatePlaylist from "./containers/createPlaylist/CreatePlaylistComponent";
import PlaylistSelector from "./containers/selectPlaylist/PlaylistSelector";
import TrackList from './containers/selectPlaylist/TrackList';

import type { PlaylistTrack } from './types/spotify';

const App: FC = (): ReactElement => {
  const dispatch = useDispatch();
  //const user = useSelector(authSelectors.getUser); // not used now later TODO add logout button

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

  return (
    <>
      <div className='header-container'>
        <div className='search'>
          <div className='search-bar'>
            <div className='search-icon'>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"></path>
              </svg>
            </div>
            <input type='text' placeholder='Search for a track' />
          </div>
          <Button label="Search" onClick={() => console.log("Search clicked")} />
        </div>
        {/* Add a dark/light button switch */}
        <Button label="Add new playlist" onClick={() => dispatch(toggleCreatePlaylist())} />
        {/* Add profile icon with logout options */}
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