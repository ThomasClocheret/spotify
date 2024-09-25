// src/containers/createPlaylist/slice.ts

import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { RequestStatus } from '../../types/requests';
import { Playlist } from '../../types/spotify';

interface PlaylistState {
  playlists: Playlist[];
  status: RequestStatus;
  error?: string;
}

const initialState: PlaylistState = {
  playlists: [],
  status: RequestStatus.IDLE,
};

// Define action payload types
export const createPlaylistRequest = createAction<{ name: string; description?: string; public?: boolean }>('playlist/createPlaylistRequest');
export const createPlaylistSuccess = createAction<Playlist>('playlist/createPlaylistSuccess');
export const createPlaylistFailure = createAction<string>('playlist/createPlaylistFailure');
export const resetCreatePlaylistState = createAction('playlist/resetCreatePlaylistState');

const createPlaylistSlice = createSlice({
  name: 'createPlaylist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylistRequest, (state) => {
        state.status = RequestStatus.PENDING;
        state.error = undefined;
      })
      .addCase(createPlaylistSuccess, (state, action: PayloadAction<Playlist>) => {
        state.status = RequestStatus.SUCCESS;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylistFailure, (state, action: PayloadAction<string>) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload;
      })
      .addCase(resetCreatePlaylistState, (state) => {
        state.status = RequestStatus.IDLE;
        state.error = undefined;
      });
  },
});

export default createPlaylistSlice.reducer;