// src/containers/editPlaylist/EditPlaylistComponent.tsx
import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updatePlaylistRequest } from './slice';
import PlaylistDetailsPanel from '../../components/playlistDetail/playlistDetail';

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
  const status = useSelector((state: RootState) => state.editPlaylist.isLoading);

  const handleUpdate = () => {
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
      title="Update playlist"
      name={name}
      description={description}
      isPublic={isPublic}
      setName={setName}
      setDescription={setDescription}
      setIsPublic={setIsPublic}
      handleSave={handleUpdate}
      isSaving={status === true}
      onCancel={onCancel}
    />
  );
};

export default EditPlaylist;