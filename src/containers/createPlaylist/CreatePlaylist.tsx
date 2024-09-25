// src/containers/createPlaylist/CreatePlaylist.tsx

import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/store';
import { RequestStatus } from '../../types/requests';
import { createPlaylistRequest, resetCreatePlaylistState } from './slice';
import { displayAlert } from '../../appSlice';
import { fetchPlaylists } from '../selectPlaylist/slice';

// Components
import PlaylistDetailsPanel from '../../components/playlistDetail/PlaylistDetail';

interface CreatePlaylistProps {
  onCancel: () => void;
}

const CreatePlaylist: FC<CreatePlaylistProps> = ({ onCancel }): ReactElement => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.createPlaylist.status);
  const error = useSelector((state: RootState) => state.createPlaylist.error);

  useEffect(() => {
    if (status === RequestStatus.SUCCESS) {
      // Reset the state
      dispatch(resetCreatePlaylistState());
      // Clear the input fields
      setName('');
      setDescription('');
      setIsPublic(true);
      // Close the panel
      onCancel();
      // Show success alert
      dispatch(displayAlert({ message: 'Playlist created successfully!', type: 'success' }));
      // Refresh playlists
      dispatch(fetchPlaylists());
    } else if (status === RequestStatus.ERROR && error) {
      // Show error alert
      dispatch(displayAlert({ message: error, type: 'error' }));
      // Keep the input fields intact
      // No action needed
      // Optionally, reset the error state
      dispatch(resetCreatePlaylistState());
    }
  }, [status, error, dispatch, onCancel]);

  const handleCreate = () => {
    if (!name.trim()) {
      dispatch(displayAlert({ message: 'Playlist name cannot be empty.', type: 'error' }));
      return;
    }
    dispatch(createPlaylistRequest({
      name,
      description,
      public: isPublic,
    }));
  };

  return (
    <PlaylistDetailsPanel
      title="Add New Playlist"
      name={name}
      description={description}
      isPublic={isPublic}
      setName={setName}
      setDescription={setDescription}
      setIsPublic={setIsPublic}
      handleSave={handleCreate}
      isSaving={status === RequestStatus.PENDING}
      onCancel={onCancel}
    />
  );
};

export default CreatePlaylist;