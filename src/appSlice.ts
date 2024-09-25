// src/appSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  showCreatePlaylist: boolean;
  showEditPlaylist: boolean;
  showAlert: boolean;
  alertMessage: string;
  alertType: 'success' | 'error';
}

const initialState: UIState = {
  showCreatePlaylist: false,
  showEditPlaylist: false,
  showAlert: false,
  alertMessage: '',
  alertType: 'success',
};

const appSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showCreatePlaylist: (state) => {
      state.showCreatePlaylist = true;
    },
    hideCreatePlaylist: (state) => {
      state.showCreatePlaylist = false;
    },
    showEditPlaylist: (state) => {
      state.showEditPlaylist = true;
    },
    hideEditPlaylist: (state) => {
      state.showEditPlaylist = false;
    },
    displayAlert: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' }>
    ) => {
      state.showAlert = true;
      state.alertMessage = action.payload.message;
      state.alertType = action.payload.type;
    },
    hideAlert: (state) => {
      state.showAlert = false;
      state.alertMessage = '';
      state.alertType = 'success';
    },
  },
});

export const {
  showCreatePlaylist,
  hideCreatePlaylist,
  showEditPlaylist,
  hideEditPlaylist,
  displayAlert,
  hideAlert,
} = appSlice.actions;

export default appSlice.reducer;