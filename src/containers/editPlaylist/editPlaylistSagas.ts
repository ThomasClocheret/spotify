// src/sagas/editPlaylistSagas.ts
import axios from 'axios';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  reorderTracksRequest,
  reorderTracksSuccess,
  reorderTracksFailure,
  addTrackRequest,
  addTrackSuccess,
  addTrackFailure,
  removeTrackRequest,
  removeTrackSuccess,
  removeTrackFailure,
  updatePlaylistRequest,
  updatePlaylistSuccess,
  updatePlaylistFailure,
} from './slice';
import { authSelectors } from '../auth/selectors';

interface ReorderTracksPayload {
  playlistId: string;
  rangeStart: number;
  insertBefore: number;
  snapshotId: string | null;
}

interface AddTrackPayload {
  playlistId: string;
  trackUri: string;
}

interface UpdatePlaylistPayload {
  playlistId: string;
  name: string;
  description?: string;
  public?: boolean;
}

function* reorderTracksSaga(
  action: PayloadAction<ReorderTracksPayload>
): Generator<any, void, any> {
  try {
    const accessToken: string = yield select(authSelectors.getAccessToken);
    const { playlistId, rangeStart, insertBefore } = action.payload;

    // Step 1: Fetch the current snapshot_id from the playlist
    const playlistResponse = yield call(() =>
      axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    );

    console.log('Fetched playlist data:', playlistResponse.data);

    const currentSnapshotId: string = playlistResponse.data.snapshot_id;

    if (!currentSnapshotId) {
      throw new Error('Failed to retrieve snapshot_id from playlist data.');
    }

    console.log('Current snapshot_id:', currentSnapshotId);

    // Step 2: Construct the request body with the latest snapshot_id
    const requestBody: any = {
      range_start: rangeStart,
      insert_before: insertBefore,
      range_length: 1,
      snapshot_id: currentSnapshotId,
    };

    console.log('Reordering tracks request:', JSON.stringify(requestBody, null, 2));

    // Step 3: Make the PUT request to reorder tracks
    const response = yield call(() =>
      axios.put(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    );

    const newSnapshotId: string = response.data.snapshot_id;

    // Step 4: Dispatch success action with the new snapshot_id
    yield put(reorderTracksSuccess({ newSnapshotId }));
    console.log('Tracks reordered successfully:', response.data);
  } catch (error: any) {
    console.error('Error reordering tracks:', error);

    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else {
      console.error('Error message:', error.message);
    }

    const errorMessage =
      error.response?.data?.error?.message || 'Failed to reorder tracks';
    yield put(reorderTracksFailure(errorMessage));
  }
}

function* addTrackSaga(action: PayloadAction<AddTrackPayload>): Generator<any, void, any> {
  try {
    const accessToken: string = yield select(authSelectors.getAccessToken);
    const { playlistId, trackUri } = action.payload;

    const requestBody = {
      uris: [trackUri],
    };

    const response = yield call(() =>
      axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    );

    yield put(addTrackSuccess());
    console.log('Track added successfully:', response.data);
  } catch (error: any) {
    console.error('Error adding track:', error);
    const errorMessage = error.response?.data?.error?.message || 'Failed to add track';
    yield put(addTrackFailure(errorMessage));
  }
}

function* removeTrackSaga(action: PayloadAction<AddTrackPayload>): Generator<any, void, any> {
  try {
    const accessToken: string = yield select(authSelectors.getAccessToken);
    const { playlistId, trackUri } = action.payload;

    const requestBody = {
      tracks: [{ uri: trackUri }]
    };

    const response = yield call(() =>
      axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: requestBody  // Axios DELETE requires 'data' to send a request body
      })
    );

    yield put(removeTrackSuccess());
    console.log('Track removed successfully:', response.data);
  } catch (error: any) {
    console.error('Error removing track:', error);
    const errorMessage = error.response?.data?.error?.message || 'Failed to remove track';
    yield put(removeTrackFailure(errorMessage));
  }
}

const updatePlaylistApi = (
  playlistId: string,
  accessToken: string,
  name: string,
  description: string,
  isPublic: boolean
) => {
  return axios.put(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
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

function* updatePlaylistSaga(action: PayloadAction<UpdatePlaylistPayload>): Generator<any, void, any> {
  try {
    const { playlistId, name, description = '', public: isPublic = true } = action.payload;
    const accessToken: string = yield select(authSelectors.getAccessToken);

    const response = yield call(() => updatePlaylistApi(playlistId, accessToken, name, description, isPublic));

    yield put(updatePlaylistSuccess());
    console.log('Playlist updated successfully:', response.data);
  } catch (error: any) {
    console.error('Error updating playlist:', error);
    yield put(updatePlaylistFailure(error.message));
  }
}

export default function* editPlaylistSaga() {
  yield takeEvery(updatePlaylistRequest.type, updatePlaylistSaga);
  yield takeEvery(reorderTracksRequest.type, reorderTracksSaga);
  yield takeEvery(addTrackRequest.type, addTrackSaga);
  yield takeEvery(removeTrackRequest.type, removeTrackSaga);
}