// src/slices/editPlaylist/slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditPlaylistState {
  isLoading: boolean;
  success: boolean;
  error: string | null;
  snapshotId: string | null; // Manages the current snapshot ID
}

const initialState: EditPlaylistState = {
  isLoading: false,
  success: false,
  error: null,
  snapshotId: null, // Initialize snapshotId
};

interface ReorderTracksPayload {
  playlistId: string;
  rangeStart: number;
  insertBefore: number;
  snapshotId: string | null;
}

interface ReorderTracksSuccessPayload {
  newSnapshotId: string;
}

const editPlaylistSlice = createSlice({
  name: 'editPlaylist',
  initialState,
  reducers: {
    reorderTracksRequest: (
      state,
      action: PayloadAction<ReorderTracksPayload>
    ) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    },
    reorderTracksSuccess: (
      state,
      action: PayloadAction<ReorderTracksSuccessPayload>
    ) => {
      state.isLoading = false;
      state.success = true;
      state.snapshotId = action.payload.newSnapshotId;
    },
    reorderTracksFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  reorderTracksRequest,
  reorderTracksSuccess,
  reorderTracksFailure,
} = editPlaylistSlice.actions;

export default editPlaylistSlice.reducer;