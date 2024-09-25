// src/test/SearchBar.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import SearchBar from '../containers/searchTracks/SearchBar';
import { searchTracksSuccess, searchTracksFailure } from '../containers/searchTracks/slice';
import { addTrackSuccess, addTrackFailure, removeTrackSuccess, removeTrackFailure } from '../containers/editPlaylist/slice';
import { displayAlert } from '../appSlice';

const mockStore = configureStore([]);

describe('SearchBar Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      searchTrack: {
        searchTerm: '',
        searchResults: [],
        loading: false,
        error: null,
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        tracks: [],
      },
      authentication: {
        accessToken: 'test-token',
        user: {
          userId: 'user1',
        },
      },
    });

    store.dispatch = jest.fn();
  });

  test('renders correctly', () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Search for a track')).toBeInTheDocument();
  });

  test('successful search displays results', () => {
    const mockTracks = [
      {
        id: 'track1',
        name: 'Track One',
        artists: [{ name: 'Artist A' }],
        album: { images: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }, { url: 'image3.jpg' }] },
        uri: 'spotify:track:track1',
      },
      {
        id: 'track2',
        name: 'Track Two',
        artists: [{ name: 'Artist B' }],
        album: { images: [{ url: 'image4.jpg' }, { url: 'image5.jpg' }, { url: 'image6.jpg' }] },
        uri: 'spotify:track:track2',
      },
    ];

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search for a track');
    fireEvent.change(input, { target: { value: 'Track' } });

    // Simulate successful search
    store = mockStore({
      searchTrack: {
        searchTerm: 'Track',
        searchResults: mockTracks,
        loading: false,
        error: null,
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        tracks: [],
      },
      authentication: {
        accessToken: 'test-token',
        user: {
          userId: 'user1',
        },
      },
    });

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    expect(screen.getByText('Track One')).toBeInTheDocument();
    expect(screen.getByText('Artist A')).toBeInTheDocument();
    expect(screen.getByText('Track Two')).toBeInTheDocument();
    expect(screen.getByText('Artist B')).toBeInTheDocument();
  });

  test('forbidden error displays specific message', async () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search for a track');
    fireEvent.change(input, { target: { value: 'Forbidden' } });

    // Simulate forbidden error
    store = mockStore({
      searchTrack: {
        searchTerm: 'Forbidden',
        searchResults: [],
        loading: false,
        error: '403 Forbidden',
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        tracks: [],
      },
      authentication: {
        accessToken: 'test-token',
        user: {
          userId: 'user1',
        },
      },
    });

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(displayAlert({ message: '403 Forbidden', type: 'error' }));
    });
  });

  test('adding a track updates the UI immediately', () => {
    const mockTracks = [
      {
        id: 'track1',
        name: 'Track One',
        artists: [{ name: 'Artist A' }],
        album: { images: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }, { url: 'image3.jpg' }] },
        uri: 'spotify:track:track1',
      },
    ];

    store = mockStore({
      searchTrack: {
        searchTerm: 'Track',
        searchResults: mockTracks,
        loading: false,
        error: null,
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        tracks: [],
      },
      authentication: {
        accessToken: 'test-token',
        user: {
          userId: 'user1',
        },
      },
    });

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const addButton = screen.getByLabelText('Add to Playlist');
    fireEvent.click(addButton);

    expect(store.dispatch).toHaveBeenCalledWith(addTrackRequest({ playlistId: 'playlist1', trackUri: 'spotify:track:track1' }));
  });

  test('removing a track updates the UI immediately', () => {
    const mockTracks = [
      {
        id: 'track1',
        name: 'Track One',
        artists: [{ name: 'Artist A' }],
        album: { images: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }, { url: 'image3.jpg' }] },
        uri: 'spotify:track:track1',
      },
    ];

    store = mockStore({
      searchTrack: {
        searchTerm: 'Track',
        searchResults: mockTracks,
        loading: false,
        error: null,
      },
      selectPlaylist: {
        selectedPlaylist: 'playlist1',
        tracks: [
          { track: mockTracks[0] },
        ],
      },
      authentication: {
        accessToken: 'test-token',
        user: {
          userId: 'user1',
        },
      },
    });

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const removeButton = screen.getByLabelText('Remove from Playlist');
    fireEvent.click(removeButton);

    expect(store.dispatch).toHaveBeenCalledWith(removeTrackRequest({ playlistId: 'playlist1', trackUri: 'spotify:track:track1' }));
  });
});