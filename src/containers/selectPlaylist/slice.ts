import { createSlice } from "@reduxjs/toolkit";
import { Playlist, PlaylistTrack } from "../../types/spotify";

interface PlaylistState {
  playlists: Array<Playlist>;
  selectedPlaylist: string | null;
  tracks: Array<PlaylistTrack>;
  loading: boolean;
  snapshotId: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  selectedPlaylist: null,
  tracks: [],
  loading: false,
  snapshotId: null,
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    fetchPlaylists: (state) => {
      state.loading = true;
    },
    fetchPlaylistsSuccess: (state, action) => {
      state.playlists = action.payload;
      state.loading = false;
    },
    fetchPlaylistsFailure: (state) => {
      state.loading = false;
    },
    selectPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    },
    fetchPlaylistTracks: (state) => {
      state.loading = true;
    },
    fetchPlaylistTracksSuccess: (state, action) => {
      state.tracks = action.payload;
      state.snapshotId = action.payload.snapshot_id;
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