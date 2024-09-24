import { call, put, select, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { fetchPlaylists, fetchPlaylistsSuccess, fetchPlaylistsFailure, fetchPlaylistTracksSuccess, fetchPlaylistTracksFailure, selectPlaylist } from "./slice";
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
    } catch (error) {
        console.error('Failed to fetch playlists:', error);
        yield put(fetchPlaylistsFailure());
    }
}

function* fetchPlaylistTracksSaga(action: { payload: string }): Generator<any, void, any> {
    try {
        const accessToken = yield select(authSelectors.getAccessToken);
        const playlistId = action.payload;

        if (!accessToken || !playlistId) {
            throw new Error('No access token or playlist ID found.');
        }

        const response = yield call(() =>
            axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        );

        console.log('Fetched playlist tracks:', response.data.items);

        yield put(fetchPlaylistTracksSuccess(response.data.items));
    } catch (error) {
        console.error('Failed to fetch playlist tracks:', error);
        yield put(fetchPlaylistTracksFailure());
    }
}


export default function* playlistSaga() {
    yield takeEvery(fetchPlaylists.type, fetchPlaylistsSaga);
    yield takeEvery(selectPlaylist, fetchPlaylistTracksSaga);
}