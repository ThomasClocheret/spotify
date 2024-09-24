// src/containers/createPlaylist/CreatePlaylistComponent.tsx
import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createPlaylistRequest } from './slice';
import PlaylistDetailsPanel from '../../components/playlistDetail/playlistDetail';

interface CreatePlaylistProps {
  onCancel: () => void;
}

const CreatePlaylist: FC<CreatePlaylistProps> = ({ onCancel }): ReactElement => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.createPlaylist.status);

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

  return (
    <PlaylistDetailsPanel
      title="Add new playlist"
      name={name}
      description={description}
      isPublic={isPublic}
      setName={setName}
      setDescription={setDescription}
      setIsPublic={setIsPublic}
      handleSave={handleCreate}
      isSaving={status === 'pending'}
      onCancel={onCancel}
    />
  );
};

export default CreatePlaylist;