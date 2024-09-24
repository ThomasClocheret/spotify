import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  showCreatePlaylist: boolean;
  showEditPlaylist: boolean;
  showAlert: boolean;
  alertMessage: string;
}

const initialState: UIState = {
  showCreatePlaylist: false,
  showEditPlaylist: false,
  showAlert: false,
  alertMessage: '',
};

const appSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCreatePlaylist: (state) => {
      state.showCreatePlaylist = !state.showCreatePlaylist;
    },
    toggleEditPlaylist: (state) => {
      state.showEditPlaylist = !state.showEditPlaylist;
    },
    displayAlert: (state, action) => {
      state.showAlert = true;
      state.alertMessage = action.payload;
    },
    hideAlert: (state) => {
      state.showAlert = false;
      state.alertMessage = '';
    },
  },
});

export const { toggleCreatePlaylist, toggleEditPlaylist, displayAlert, hideAlert } = appSlice.actions;

export default appSlice.reducer;