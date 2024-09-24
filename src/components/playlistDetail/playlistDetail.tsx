import './playlistDetail.css';

import { FC, ReactElement } from 'react';
import Button from '../button/Button';

interface PlaylistDetailsPanelProps {
  title: string;
  name: string;
  description: string;
  isPublic: boolean;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  handleSave: () => void;
  isSaving: boolean;
  onCancel: () => void;
}

const PlaylistDetailsPanel: FC<PlaylistDetailsPanelProps> = ({
  title,
  name,
  description,
  isPublic,
  setName,
  setDescription,
  setIsPublic,
  handleSave,
  isSaving,
  onCancel,
}): ReactElement => {
  return (
    <>
      <div className="playlistDetailsPanel-overlay" />
      <div className="playlistDetailsPanel">
        <h2>{title}</h2>
        <input
          type="text"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Playlist description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="toggle-container">
          <span className="toggle-label">{isPublic ? 'Public' : 'Private'}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="playlistDetailsPanel-container-buttons">
          <Button label="Cancel" onClick={onCancel} />
          <Button label={isSaving ? 'Saving...' : 'Save'} onClick={handleSave} />
        </div>
      </div>
    </>
  );
};

export default PlaylistDetailsPanel;