import './createPlaylist.css';

import React, { FC, ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createPlaylistRequest } from './slice';
import { RootState } from '../../store/store';

import Button from '../../components/button/Button';

interface CreatePlaylistProps {
  onCancel: () => void;
}

const CreatePlaylistComponent: FC<CreatePlaylistProps> = ({ onCancel }): ReactElement => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(true);

  const dispatch = useDispatch();

  const status = useSelector((state: RootState) => state.createPlaylist.status);

  // Reset state when component mounts (i.e., when modal is opened)
  useEffect(() => {
    setName('');
    setDescription('');
    setIsPublic(true);
  }, []);

  const handleCreate = () => {
    dispatch(
      createPlaylistRequest({
        name,
        description,
        public: isPublic,
      })
    );
  };

  useEffect(() => {
    if (status === 'success') {
      onCancel(); // Close the modal after successful creation
    }
  }, [status, onCancel]);

  return (
    <>
      <div className="createPlaylist-overlay" />
      <div className="createPlaylist">
        <h2>Add new playlist</h2>
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
        <div>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public
          </label>
        </div>
        <div className="createPlaylist-container-buttons">
          <Button label="Cancel" onClick={onCancel} />
          <Button
            label={status === 'pending' ? 'Creating...' : 'Create'}
            onClick={handleCreate}
          />
        </div>
      </div>
    </>
  );
};

export default CreatePlaylistComponent;