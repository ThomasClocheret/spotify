import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface EditPlaylistState {
  isLoading: boolean;
  success: boolean;
  error: string | null;
  snapshotId: string | null;
}

const initialState: EditPlaylistState = {
  isLoading: false,
  success: false,
  error: null,
  snapshotId: null,
};

export const updatePlaylistRequest = createAction<{
  playlistId: string;
  name: string;
  description?: string;
  public?: boolean;
}>('editPlaylist/updatePlaylistRequest');

export const updatePlaylistSuccess = createAction('editPlaylist/updatePlaylistSuccess');
export const updatePlaylistFailure = createAction<string>('editPlaylist/updatePlaylistFailure');

interface ReorderTracksPayload {
  playlistId: string;
  rangeStart: number;
  insertBefore: number;
  snapshotId: string | null;
}

interface ReorderTracksSuccessPayload {
  newSnapshotId: string;
}

interface AddTrackPayload {
  playlistId: string;
  trackUri: string;
}

const editPlaylistSlice = createSlice({
  name: 'editPlaylist',
  initialState,
  reducers: {
    addTrackRequest: (state, action: PayloadAction<AddTrackPayload>) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    },
    addTrackSuccess: (state) => {
      state.isLoading = false;
      state.success = true;
    },
    addTrackFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    reorderTracksRequest: (state, action: PayloadAction<ReorderTracksPayload>) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    },
    reorderTracksSuccess: (state, action: PayloadAction<ReorderTracksSuccessPayload>) => {
      state.isLoading = false;
      state.success = true;
      state.snapshotId = action.payload.newSnapshotId;
    },
    reorderTracksFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    removeTrackRequest: (state, action: PayloadAction<AddTrackPayload>) => {
      state.isLoading = true;
    },
    removeTrackSuccess: (state) => {
      state.isLoading = false;
    },
    removeTrackFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  reorderTracksRequest,
  reorderTracksSuccess,
  reorderTracksFailure,
  addTrackRequest,
  addTrackSuccess,
  addTrackFailure,
  removeTrackRequest,
  removeTrackSuccess,
  removeTrackFailure,
} = editPlaylistSlice.actions;

export default editPlaylistSlice.reducer;