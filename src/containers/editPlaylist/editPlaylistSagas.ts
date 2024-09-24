// src/sagas/editPlaylistSagas.ts

import { call, put, takeEvery, select } from 'redux-saga/effects';
import axios from 'axios';
import {
  reorderTracksRequest,
  reorderTracksSuccess,
  reorderTracksFailure,
} from './slice';
import { authSelectors } from '../auth/selectors';
import { PayloadAction } from '@reduxjs/toolkit';

interface ReorderTracksPayload {
  playlistId: string;
  rangeStart: number;
  insertBefore: number;
  snapshotId: string | null;
}

interface ReorderTracksSuccessPayload {
  newSnapshotId: string;
}

function* reorderTracksSaga(
  action: PayloadAction<ReorderTracksPayload>
): Generator<any, void, any> {
  try {
    const accessToken: string = yield select(authSelectors.getAccessToken);
    const { playlistId, rangeStart, insertBefore, snapshotId } = action.payload;

    // Construct the request body based on Spotify's API requirements
    const requestBody: any = {
      range_start: rangeStart,
      insert_before: insertBefore,
      // Spotify's API allows omitting snapshot_id, so include it only if available
      ...(snapshotId && { snapshot_id: snapshotId }),
    };

    // Make the PUT request to reorder tracks
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

    // Extract the new snapshot_id from the response
    const newSnapshotId: string = response.data.snapshot_id;

    // Dispatch success action with the new snapshot_id
    yield put(reorderTracksSuccess({ newSnapshotId }));
    console.log('Tracks reordered successfully:', response.data);
  } catch (error: any) {
    console.error('Error reordering tracks:', error);

    // Log detailed error information
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

export default function* editPlaylistSaga() {
  yield takeEvery(reorderTracksRequest.type, reorderTracksSaga);
}