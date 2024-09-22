import './styles/App.css';
import React, { FC, ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "./containers/auth/selectors";

// Components
import Button from "./components/button/Button";
import AddPlaylist from "./components/addPlaylist/AddPlaylist";

const App: FC = (): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);

  const [draggedTrack, setDraggedTrack] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // State to control AddPlaylist visibility
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);

  const handleDragStart = (index: number) => {
    setDraggedTrack(index);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedTrack !== index) {
      // Handle drag logic, if necessary.
    }
  };

  const handleDrop = (index: number) => {
    // Logic to reorder the tracks based on the drop position can go here.
    setDraggedTrack(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTrack(null);
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
        {/* Add the onClick to show AddPlaylist */}
        <Button label="Add new playlist" onClick={() => setShowAddPlaylist(true)} />
        {/* Add profile icon with logout options */}
      </div>

      <div className='content-container'>
        <div className="playlist-select">
          <div className="playlist-select-left">
            <div className="playlist-selector">
              <img src="https://via.placeholder.com/32" alt="playlist" />
              <p>My Playlist</p>
              <svg className="chevron-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.41 8.42L12 13l4.59-4.58L18 10l-6 6-6-6z"></path>
              </svg>
            </div>
            <Button label="Edit playlist" onClick={() => console.log("Edit playlist clicked")} />
            <p>selected playlist description</p>
          </div>
          <div className="filter-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h18v2H3V4zm3 7h12v2H6v-2zm4 5h4v2h-4v-2z"></path>
            </svg>
          </div>
        </div>

        <div className="track-list">
          {[...Array(4)].map((_, index) => (
            <div
              className={`track ${draggedTrack === index ? "dragging" : ""} ${isDragging ? "is-dragging" : ""}`}
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
            >
              <div className="track-drag">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 11h12v2H6zm0 4h12v2H6zm0-8h12v2H6z"></path>
                </svg>
              </div>
              <div className="track-detail">
                <img src="https://via.placeholder.com/50" alt="track" />
                <div className="track-info">
                  <p>Track title {index + 1}</p>
                  <p>Artist</p>
                </div>
                <p className='track-details'>Album</p>
                <p className='track-details'>Release date</p>
                <div className="track-actions">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 10a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddPlaylist && <AddPlaylist onCancel={() => setShowAddPlaylist(false)} />}
    </>
  );
};

export default App;