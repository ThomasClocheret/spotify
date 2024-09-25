// src/containers/editPlaylist/editPlaylistSagas.ts

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
import { displayAlert } from '../../appSlice';
import { fetchPlaylistTracks, fetchPlaylists } from '../selectPlaylist/slice';

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

    const currentSnapshotId: string = playlistResponse.data.snapshot_id;

    if (!currentSnapshotId) {
      throw new Error('Failed to retrieve snapshot_id from playlist data.');
    }

    // Step 2: Construct the request body with the latest snapshot_id
    const requestBody: any = {
      range_start: rangeStart,
      insert_before: insertBefore,
      range_length: 1,
      snapshot_id: currentSnapshotId,
    };

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
    yield put(displayAlert({ message: 'Tracks reordered successfully!', type: 'success' }));

  } catch (error: any) {

    let errorMessage = 'Failed to reorder tracks';
    if (error.response) {
      if (error.response.status === 403) {
        errorMessage = 'You must be the owner of the playlist to reorder tracks.';
      } else {
        errorMessage = error.response.data.error.message || errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    yield put(reorderTracksFailure(errorMessage));
    yield put(displayAlert({ message: errorMessage, type: 'error' }));
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
    yield put(displayAlert({ message: 'Track added successfully!', type: 'success' }));
    yield put(fetchPlaylistTracks(playlistId));
  } catch (error: any) {
    let errorMessage = 'Failed to add track';
    if (error.response && error.response.status === 403) {
      errorMessage = 'You should be the owner of the playlist to add a track.';
    } else if (error.response) {
      errorMessage = error.response.data.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    yield put(addTrackFailure(errorMessage));
    yield put(displayAlert({ message: errorMessage, type: 'error' }));
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
        data: requestBody
      })
    );

    yield put(removeTrackSuccess());
    yield put(displayAlert({ message: 'Track removed successfully!', type: 'success' }));

    // Refresh the playlist tracks
    yield put(fetchPlaylistTracks(playlistId));
  } catch (error: any) {
    let errorMessage = 'Failed to remove track';
    if (error.response && error.response.status === 403) {
      errorMessage = 'You should be the owner of the playlist to remove a track.';
    } else if (error.response) {
      errorMessage = error.response.data.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    yield put(removeTrackFailure(errorMessage));
    yield put(displayAlert({ message: errorMessage, type: 'error' }));
  }
}

function* updatePlaylistSaga(action: PayloadAction<UpdatePlaylistPayload>): Generator<any, void, any> {
  try {
    const { playlistId, name, description = '', public: isPublic = true } = action.payload;
    const accessToken: string = yield select(authSelectors.getAccessToken);

    const response = yield call(() =>
      axios.put(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        { name, description, public: isPublic },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    );

    yield put(updatePlaylistSuccess());
    yield put(displayAlert({ message: 'Playlist updated successfully!', type: 'success' }));

    // Refresh playlists and tracks
    yield put(fetchPlaylists());
    yield put(fetchPlaylistTracks(playlistId));
  } catch (error: any) {
    yield put(updatePlaylistFailure(error.message));
    yield put(displayAlert({ message: error.message || 'Failed to update playlist.', type: 'error' }));
  }
}

export default function* editPlaylistSaga() {
  yield takeEvery(updatePlaylistRequest.type, updatePlaylistSaga);
  yield takeEvery(reorderTracksRequest.type, reorderTracksSaga);
  yield takeEvery(addTrackRequest.type, addTrackSaga);
  yield takeEvery(removeTrackRequest.type, removeTrackSaga);
}