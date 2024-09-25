// src/containers/selectPlaylist/slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playlist, PlaylistTrack } from "../../types/spotify";

interface PlaylistState {
  playlists: Array<Playlist>;
  selectedPlaylist: string | null;
  tracks: Array<PlaylistTrack>;
  loading: boolean;
  snapshotId: string | null;
  error: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  selectedPlaylist: null,
  tracks: [],
  loading: false,
  snapshotId: null,
  error: null,
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    fetchPlaylists: (state) => {
      state.loading = true;
    },
    fetchPlaylistsSuccess: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload;
      state.loading = false;
    },
    fetchPlaylistsFailure: (state) => {
      state.loading = false;
    },
    selectPlaylist: (state, action: PayloadAction<string>) => {
      state.selectedPlaylist = action.payload;
    },
    fetchPlaylistTracks: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },
    fetchPlaylistTracksSuccess: (state, action: PayloadAction<PlaylistTrack[]>) => {
      state.tracks = action.payload;
      state.loading = false;
    },
    fetchPlaylistTracksFailure: (state) => {
      state.loading = false;
    },
  },
});

export const {
  fetchPlaylists,
  fetchPlaylistsSuccess,
  fetchPlaylistsFailure,
  selectPlaylist,
  fetchPlaylistTracks,
  fetchPlaylistTracksSuccess,
  fetchPlaylistTracksFailure,
} = playlistSlice.actions;

export default playlistSlice.reducer;