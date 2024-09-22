import React from "react";
import './track.module.css';

interface TrackProps {
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

const Track: React.FC<TrackProps> = ({ title, artist, album, releaseDate, onDragStart, onDragOver, onDrop, onDragEnd }) => {
  return (
    <div className="track" draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}>
      <div className="track-drag">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 11h12v2H6zm0 4h12v2H6zm0-8h12v2H6z"></path>
        </svg>
      </div>
      <div className="track-detail">
        <img src="https://via.placeholder.com/50" alt="track" />
        <div className="track-info">
          <p>{title}</p>
          <p>{artist}</p>
        </div>
        <p className="track-details">{album}</p>
        <p className="track-details">{releaseDate}</p>
        <div className="track-actions">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 10a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Track;