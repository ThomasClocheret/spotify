// src/components/track/Track.tsx

import React from 'react';
import './track.css';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

interface Artist {
  name: string;
}

interface Album {
  name?: string;
  images?: { url: string }[];
  release_date?: string;
}

interface TrackData {
  name?: string;
  artists?: Artist[];
  album?: Album;
}

interface TrackProps {
  track: TrackData;
  index: number;
  isDragging: boolean;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const Track: React.FC<TrackProps> = ({ track, isDragging, provided, snapshot }) => {
  const { name = 'Unknown Track', artists = [], album } = track;
  const albumImageUrl = album?.images?.[0]?.url || 'https://via.placeholder.com/50';
  const albumName = album?.name || 'Unknown Album';
  const releaseDate = album?.release_date || 'Unknown Release Date';

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`track ${isDragging ? 'dragging' : ''}`}
      style={{
        ...provided.draggableProps.style,
        opacity: isDragging ? 0.8 : 1,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <div className="track-drag" {...provided.dragHandleProps}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 11h12v2H6zm0 4h12v2H6zm0-8h12v2H6z"></path>
        </svg>
      </div>
      <div className="track-detail">
        <img src={albumImageUrl} alt={name} width="50" />
        <div className="track-info">
          <p className="track-name">{name}</p>
          <p className="track-artists">
            {artists.length > 0
              ? artists.map((artist: Artist) => artist.name).join(', ')
              : 'Unknown Artist'}
          </p>
        </div>
        <p className="track-details">{albumName}</p>
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