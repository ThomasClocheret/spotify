// src/containers/createPlaylist/createPlaylistSagas.ts

import axios from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { createPlaylistRequest, createPlaylistSuccess, createPlaylistFailure } from './slice'; 
import { authSelectors } from '../auth/selectors'; 
import { displayAlert } from '../../appSlice';
import { fetchPlaylists, selectPlaylist } from '../selectPlaylist/slice';
import { Playlist } from '../../types/spotify';
import { SagaIterator } from 'redux-saga';

// Define the API function
const createPlaylistApi = (
  userId: string,
  accessToken: string,
  name: string,
  description: string,
  isPublic: boolean
) => {
  return axios.post(
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
  );
};

function* addPlaylist(action: ReturnType<typeof createPlaylistRequest>): SagaIterator {
  try {
    const { name, description = "", public: isPublic = true } = action.payload;

    const accessToken: string = yield select(authSelectors.getAccessToken);
    const user = yield select(authSelectors.getUser);
    const userId = user?.userId;

    if (!accessToken) throw new Error('No access token available');
    if (!userId) throw new Error('No user ID available');

    const response = yield call(() => createPlaylistApi(userId, accessToken, name, description, isPublic));

    yield put(createPlaylistSuccess(response.data));

    // Automatically select the newly created playlist
    yield put(selectPlaylist(response.data.id));

    // Dispatch success alert
    yield put(displayAlert({ message: 'Playlist created successfully!', type: 'success' }));
  } catch (error: any) {
    yield put(createPlaylistFailure(error.message));
    yield put(displayAlert({ message: error.message || 'Failed to create playlist.', type: 'error' }));
  }
}

export default function* createPlaylistSaga() {
  yield takeEvery(createPlaylistRequest.type, addPlaylist);
}