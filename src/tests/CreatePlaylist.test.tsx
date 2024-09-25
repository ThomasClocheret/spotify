// src/tests/CreatePlaylist.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import CreatePlaylist from '../containers/createPlaylist/CreatePlaylist';
import { RequestStatus } from '../types/requests';
import { createPlaylistSuccess, createPlaylistFailure, resetCreatePlaylistState } from '../containers/createPlaylist/slice';
import { fetchPlaylists } from '../containers/selectPlaylist/slice';
import { displayAlert } from '../appSlice';

const mockStore = configureStore([]);

describe('CreatePlaylist Component', () => {
  let store: any;
  let onCancelMock: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      createPlaylist: {
        status: RequestStatus.IDLE,
        error: null,
      },
    });

    store.dispatch = jest.fn();
    onCancelMock = jest.fn();
  });

  test('renders correctly', () => {
    render(
      <Provider store={store}>
        <CreatePlaylist onCancel={onCancelMock} />
      </Provider>
    );

    expect(screen.getByText('Add New Playlist')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Playlist name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Playlist description (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Public')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('successful playlist creation', async () => {
    // Simulate success state
    store = mockStore({
      createPlaylist: {
        status: RequestStatus.SUCCESS,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <CreatePlaylist onCancel={onCancelMock} />
      </Provider>
    );

    // Wait for useEffect to trigger
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(resetCreatePlaylistState());
      expect(onCancelMock).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(displayAlert({ message: 'Playlist created successfully!', type: 'success' }));
      expect(store.dispatch).toHaveBeenCalledWith(fetchPlaylists());
    });
  });

  test('failed playlist creation', async () => {
    // Simulate error state
    store = mockStore({
      createPlaylist: {
        status: RequestStatus.ERROR,
        error: 'Server error',
      },
    });

    render(
      <Provider store={store}>
        <CreatePlaylist onCancel={onCancelMock} />
      </Provider>
    );

    // Wait for useEffect to trigger
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(displayAlert({ message: 'Server error', type: 'error' }));
      expect(store.dispatch).toHaveBeenCalledWith(resetCreatePlaylistState());
      expect(onCancelMock).not.toHaveBeenCalled();
    });
  });

  test('empty playlist name shows error alert', () => {
    render(
      <Provider store={store}>
        <CreatePlaylist onCancel={onCancelMock} />
      </Provider>
    );

    const saveButton = screen.getByText('Save');

    fireEvent.click(saveButton);

    expect(store.dispatch).toHaveBeenCalledWith(displayAlert({ message: 'Playlist name cannot be empty.', type: 'error' }));
  });
});