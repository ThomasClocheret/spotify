import React from "react";
import './Playlist.css';

interface PlaylistProps {
  name: string;
  description: string;
  onEdit: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({ name, description, onEdit }) => {
  return (
    <div className="playlist">
      <p>{name}</p>
      <p>{description}</p>
      <button onClick={onEdit}>Edit Playlist</button>
    </div>
  );
};

export default Playlist;