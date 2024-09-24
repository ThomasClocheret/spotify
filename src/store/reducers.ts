import { combineReducers } from "redux";

import appSlice from "../appSlice";
import authentication from "../containers/auth/slice";
import createPlaylist from "../containers/createPlaylist/slice";
import editPlaylist from '../containers/editPlaylist/slice';
import selectPlaylist from "../containers/selectPlaylist/slice";

const rootReducer = combineReducers({
  appSlice,
  authentication,
  createPlaylist,
  editPlaylist,
  selectPlaylist,
});

export default rootReducer;