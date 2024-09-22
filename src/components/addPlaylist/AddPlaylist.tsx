import './addPlaylist.css';
import React, { FC, ReactElement } from "react";
import Button from "../button/Button";

interface AddPlaylistProps {
  onCancel: () => void;
}

const AddPlaylist: FC<AddPlaylistProps> = ({ onCancel }): ReactElement => {
  return (
    <>
      <div className="addPlaylist-overlay" />
      <div className="addPlaylist">
        <h2>Add new playlist</h2>
        <input type="text" placeholder="Playlist name" />
        <textarea placeholder="Playlist description (optional)" />
        <div className="playlist-container-buttons">
          <Button label="Cancel" onClick={onCancel} />
          <Button label="Create" onClick={() => console.log("Create clicked")} />
        </div>
      </div>
    </>
  );
};

export default AddPlaylist;