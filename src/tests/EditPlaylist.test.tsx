// src/tests/EditPlaylist.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import EditPlaylist from '../containers/editPlaylist/EditPlaylist';
import { RequestStatus } from '../types/requests';
import { updatePlaylistSuccess, updatePlaylistFailure } from '../containers/editPlaylist/slice';
import { displayAlert } from '../appSlice';

const mockStore = configureStore([]);

describe('EditPlaylist Component', () => {
  let store: any;
  let onCancelMock: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      editPlaylist: {
        isLoading: false,
        success: false,
        error: null,
        snapshotId: null,
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        playlists: [
          { id: 'playlist1', name: 'My Playlist', description: 'Description', images: [] },
        ],
        tracks: [],
      },
    });

    store.dispatch = jest.fn();
    onCancelMock = jest.fn();
  });

  test('renders correctly', () => {
    render(
      <Provider store={store}>
        <EditPlaylist
          playlistId="playlist1"
          initialName="My Playlist"
          initialDescription="Description"
          initialPublic={true}
          onCancel={onCancelMock}
        />
      </Provider>
    );

    expect(screen.getByText('Update Playlist')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Playlist name')).toHaveValue('My Playlist');
    expect(screen.getByPlaceholderText('Playlist description (optional)')).toHaveValue('Description');
    expect(screen.getByLabelText('Public')).toBeChecked();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('successful playlist update', async () => {
    // Simulate success state
    store = mockStore({
      editPlaylist: {
        isLoading: false,
        success: true,
        error: null,
        snapshotId: null,
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        playlists: [
          { id: 'playlist1', name: 'My Playlist', description: 'Description', images: [] },
        ],
        tracks: [],
      },
    });

    render(
      <Provider store={store}>
        <EditPlaylist
          playlistId="playlist1"
          initialName="My Playlist"
          initialDescription="Description"
          initialPublic={true}
          onCancel={onCancelMock}
        />
      </Provider>
    );

    // Wait for useEffect to trigger
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(resetEditPlaylistState());
      expect(onCancelMock).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(displayAlert({ message: 'Playlist updated successfully!', type: 'success' }));
      expect(store.dispatch).toHaveBeenCalledWith(fetchPlaylists());
      expect(store.dispatch).toHaveBeenCalledWith(fetchPlaylistTracks('playlist1'));
    });
  });

  test('failed playlist update due to forbidden access', async () => {
    // Simulate error state
    store = mockStore({
      editPlaylist: {
        isLoading: false,
        success: false,
        error: '403 Forbidden',
        snapshotId: null,
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        playlists: [
          { id: 'playlist1', name: 'My Playlist', description: 'Description', images: [] },
        ],
        tracks: [],
      },
    });

    render(
      <Provider store={store}>
        <EditPlaylist
          playlistId="playlist1"
          initialName="My Playlist"
          initialDescription="Description"
          initialPublic={true}
          onCancel={onCancelMock}
        />
      </Provider>
    );

    // Wait for useEffect to trigger
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(displayAlert({ message: 'You should be the owner of the playlist to edit it.', type: 'error' }));
      expect(store.dispatch).toHaveBeenCalledWith(resetEditPlaylistState());
      expect(onCancelMock).not.toHaveBeenCalled();
    });
  });

  test('empty playlist name shows error alert', () => {
    render(
      <Provider store={store}>
        <EditPlaylist
          playlistId="playlist1"
          initialName="My Playlist"
          initialDescription="Description"
          initialPublic={true}
          onCancel={onCancelMock}
        />
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText('Playlist name');
    const saveButton = screen.getByText('Save');

    fireEvent.change(nameInput, { target: { value: ' ' } });
    fireEvent.click(saveButton);

    expect(store.dispatch).toHaveBeenCalledWith(displayAlert({ message: 'Playlist name cannot be empty.', type: 'error' }));
  });
});