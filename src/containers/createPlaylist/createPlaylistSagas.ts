import axios from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { SagaIterator } from 'redux-saga';
import { createPlaylistRequest, createPlaylistSuccess, createPlaylistFailure } from './slice'; 
import { authSelectors } from '../auth/selectors'; 

// API request function
const createPlaylistApi = (userId: string, accessToken: string, name: string, description: string, isPublic: boolean) => {
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
  } catch (error: any) {
    yield put(createPlaylistFailure(error.message));
  }
}

export default function* createPlaylistSaga() {
  yield takeEvery(createPlaylistRequest.type, addPlaylist);
}
