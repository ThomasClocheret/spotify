import { all } from "@redux-saga/core/effects";

import authSaga from "../containers/auth/authSagas";
import createPlaylistSaga from '../containers/createPlaylist/createPlaylistSagas';
import editPlaylistSaga from '../containers/editPlaylist/editPlaylistSagas';
import selectPlaylistSaga from "../containers/selectPlaylist/selectPlaylistSagas";

export default function* rootSaga() {
  yield all([authSaga(), createPlaylistSaga(), editPlaylistSaga(), selectPlaylistSaga()]);
}  