import { combineReducers } from "redux";

import appSlice from "../appSlice";
import authentication from "../containers/auth/slice";
import createPlaylist from "../containers/createPlaylist/slice";
import editPlaylist from '../containers/editPlaylist/slice';
import selectPlaylist from "../containers/selectPlaylist/slice";
import searchTrack from "../containers/searchTracks/slice";

const rootReducer = combineReducers({
  appSlice,
  authentication,
  createPlaylist,
  editPlaylist,
  selectPlaylist,
  searchTrack,
});

export default rootReducer;