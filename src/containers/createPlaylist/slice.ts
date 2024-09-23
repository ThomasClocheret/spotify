import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { RequestStatus } from '../../types/requests';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  public: boolean;
  tracks: any[];
}

export interface PlaylistState {
  playlists: Playlist[];
  status: RequestStatus;
  error?: string;
}

const initialState: PlaylistState = {
  playlists: [],
  status: RequestStatus.IDLE,
};

// Create actions
export const createPlaylistRequest = createAction<{ name: string; description?: string; public?: boolean }>('playlist/createPlaylistRequest');
export const createPlaylistSuccess = createAction<Playlist>('playlist/createPlaylistSuccess');
export const createPlaylistFailure = createAction<string>('playlist/createPlaylistFailure');

// Create slice
const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylistRequest, (state) => {
        state.status = RequestStatus.PENDING;
        state.error = undefined;
      })
      .addCase(createPlaylistSuccess, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylistFailure, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload;
      });
  },
});

export default playlistSlice.reducer;