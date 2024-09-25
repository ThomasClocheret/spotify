// src/containers/editPlaylist/EditPlaylist.tsx

import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/store';
import { displayAlert } from '../../appSlice';
import { updatePlaylistRequest, resetEditPlaylistState } from './slice';
import { fetchPlaylists, fetchPlaylistTracks } from '../selectPlaylist/slice';

import PlaylistDetailsPanel from '../../components/playlistDetail/PlaylistDetail';

interface EditPlaylistProps {
  playlistId: string;
  initialName: string;
  initialDescription: string;
  initialPublic: boolean;
  onCancel: () => void;
}

const EditPlaylist: FC<EditPlaylistProps> = ({
  playlistId,
  initialName,
  initialDescription,
  initialPublic,
  onCancel,
}): ReactElement => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialPublic);

  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.editPlaylist.isLoading);
  const success = useSelector((state: RootState) => state.editPlaylist.success);
  const error = useSelector((state: RootState) => state.editPlaylist.error);

  useEffect(() => {
    if (success) {
      // Reset the state
      dispatch(resetEditPlaylistState());
      // Close the panel
      onCancel();
      // Show success alert
      dispatch(displayAlert({ message: 'Playlist updated successfully!', type: 'success' }));
      // Refresh playlists and tracks
      dispatch(fetchPlaylists());
      dispatch(fetchPlaylistTracks(playlistId));
    } else if (error) {
      if (error.includes('403')) {
        dispatch(displayAlert({ message: 'You should be the owner of the playlist to edit it.', type: 'error' }));
      } else {
        dispatch(displayAlert({ message: 'Failed to update playlist.', type: 'error' }));
      }
      // Reset the state
      dispatch(resetEditPlaylistState());
    }
  }, [success, error, dispatch, onCancel, playlistId]);

  const handleUpdate = () => {
    if (!name.trim()) {
      dispatch(displayAlert({ message: 'Playlist name cannot be empty.', type: 'error' }));
      return;
    }
    dispatch(
      updatePlaylistRequest({
        playlistId,
        name,
        description,
        public: isPublic,
      })
    );
  };

  return (
    <PlaylistDetailsPanel
      title="Update Playlist"
      name={name}
      description={description}
      isPublic={isPublic}
      setName={setName}
      setDescription={setDescription}
      setIsPublic={setIsPublic}
      handleSave={handleUpdate}
      isSaving={isLoading}
      onCancel={() => {
        dispatch(resetEditPlaylistState());
        onCancel();
      }}
    />
  );
};

export default EditPlaylist;