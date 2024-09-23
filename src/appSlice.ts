import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  showCreatePlaylist: boolean;
  showAlert: boolean;
  alertMessage: string;
}

const initialState: UIState = {
  showCreatePlaylist: false,
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

export const { toggleCreatePlaylist, displayAlert, hideAlert } = appSlice.actions;

export default appSlice.reducer;