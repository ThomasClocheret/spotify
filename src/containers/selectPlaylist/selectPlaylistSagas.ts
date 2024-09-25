// src/containers/selectPlaylist/selectPlaylistSagas.ts

import axios from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";

import { fetchPlaylists, fetchPlaylistsSuccess, fetchPlaylistsFailure, selectPlaylist, fetchPlaylistTracks, fetchPlaylistTracksSuccess, fetchPlaylistTracksFailure } from "./slice";
import { displayAlert } from '../../appSlice';
import { RootState } from "../../store/store";
import { authSelectors } from "../auth/selectors";

function* fetchPlaylistsSaga(): Generator<any, void, any> {
    try {
        const accessToken: string = yield select(authSelectors.getAccessToken);
        const user = yield select(authSelectors.getUser);
        const userId = user?.userId;

        if (!accessToken) {
            throw new Error('No access token available');
        }
        if (!userId) {
            throw new Error('No user ID available');
        }

        const response = yield call(() =>
            axios.get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        );

        yield put(fetchPlaylistsSuccess(response.data.items));

        // Automatically select the first playlist if none is selected
        const state: RootState = yield select();
        if (!state.selectPlaylist.selectedPlaylist && response.data.items.length > 0) {
            yield put(selectPlaylist(response.data.items[0].id));
        }
    } catch (error: any) {
        console.error('Failed to fetch playlists:', error);
        yield put(fetchPlaylistsFailure());
        yield put(displayAlert({ message: 'Failed to fetch playlists.', type: 'error' }));
    }
}

function* fetchPlaylistTracksSaga(action: ReturnType<typeof selectPlaylist>): Generator<any, void, any> {
    try {
        const accessToken: string = yield select(authSelectors.getAccessToken);
        const playlistId = action.payload;

        if (!accessToken) {
            throw new Error('No access token available');
        }

        const response = yield call(() =>
            axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        );

        yield put(fetchPlaylistTracksSuccess(response.data.items));
    } catch (error: any) {
        console.error('Failed to fetch playlist tracks:', error);
        yield put(fetchPlaylistTracksFailure());
        yield put(displayAlert({ message: 'Failed to fetch playlist tracks.', type: 'error' }));
    }
}

export default function* playlistSaga() {
    yield takeEvery(fetchPlaylists.type, fetchPlaylistsSaga);
    yield takeEvery(selectPlaylist.type, fetchPlaylistTracksSaga);
    yield takeEvery(fetchPlaylistTracks.type, fetchPlaylistTracksSaga);
}