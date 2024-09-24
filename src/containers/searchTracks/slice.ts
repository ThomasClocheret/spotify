import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrackObject } from "../../types/spotify";

interface SearchTrackState {
  searchTerm: string;
  searchResults: TrackObject[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchTrackState = {
  searchTerm: "",
  searchResults: [],
  loading: false,
  error: null,
};

const searchTrackSlice = createSlice({
  name: "searchTrack",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    searchTracks(state) {
      state.loading = true;
      state.error = null;
    },
    searchTracksSuccess(state, action: PayloadAction<TrackObject[]>) {
      state.searchResults = action.payload;
      state.loading = false;
    },
    searchTracksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = [];
      state.searchTerm = "";
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setSearchTerm,
  searchTracks,
  searchTracksSuccess,
  searchTracksFailure,
  clearSearchResults,
} = searchTrackSlice.actions;

export default searchTrackSlice.reducer;