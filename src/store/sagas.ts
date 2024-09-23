import { all } from "@redux-saga/core/effects";

import authSaga from "../containers/auth/authSagas";
import createPlaylistSaga from '../containers/createPlaylist/createPlaylistSagas';

export default function* rootSaga() {
  yield all([authSaga(), createPlaylistSaga()]);
}  