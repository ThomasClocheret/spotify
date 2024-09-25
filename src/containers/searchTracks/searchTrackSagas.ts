import axios from "axios";
import { call, put, debounce, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";

import { searchTracksSuccess, searchTracksFailure, setSearchTerm } from "./slice";
import { RootState } from "../../store/store";
import { TrackObject } from "../../types/spotify";

const getSearchTerm = (state: RootState) => state.searchTrack.searchTerm;

function* performSearch(): SagaIterator {
  try {
    const searchTerm: string = yield select(getSearchTerm);
    if (!searchTerm) {
      yield put(searchTracksSuccess([]));
      return;
    }

    const accessToken: string = yield select((state: RootState) => state.authentication.accessToken);
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = yield call(() =>
      axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: searchTerm,
          type: "track",
          limit: 20,
        },
      })
    );

    const tracks: TrackObject[] = response.data.tracks.items;
    yield put(searchTracksSuccess(tracks));
  } catch (error: any) {
    console.error("Search failed:", error);
    yield put(searchTracksFailure(error.message || "Search failed"));
  }
}

function* watchSearchTracks(): SagaIterator {
  // Debounce the search input by 500ms to avoid excessive API calls
  yield debounce(500, setSearchTerm.type, performSearch);
}

export default watchSearchTracks;