// src/containers/createPlaylist/createPlaylistSagas.ts

import axios from "axios";
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeEvery } from "redux-saga/effects";

import { createPlaylistRequest, createPlaylistSuccess, createPlaylistFailure } from './slice'; 
import { authSelectors } from '../auth/selectors'; 
import { displayAlert } from '../../appSlice';
import { selectPlaylist } from '../selectPlaylist/slice';

function* addPlaylist(action: ReturnType<typeof createPlaylistRequest>): SagaIterator {
  try {
    const { name, description = "", public: isPublic = true } = action.payload;

    const accessToken: string = yield select(authSelectors.getAccessToken);
    const user = yield select(authSelectors.getUser);
    const userId = user?.userId;

    if (!accessToken) throw new Error('No access token available');
    if (!userId) throw new Error('No user ID available');

    // Inline the API call here
    const response = yield call(() =>
      axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name,
          description,
          public: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    );

    yield put(createPlaylistSuccess(response.data));

    // Automatically select the newly created playlist
    yield put(selectPlaylist(response.data.id));

    // Dispatch success alert
    yield put(displayAlert({ message: 'Playlist created successfully!', type: 'success' }));
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to create playlist.';
    yield put(createPlaylistFailure(errorMessage));
    yield put(displayAlert({ message: errorMessage, type: 'error' }));
  }
}

export default function* createPlaylistSaga() {
  yield takeEvery(createPlaylistRequest.type, addPlaylist);
}