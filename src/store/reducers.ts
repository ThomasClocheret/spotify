import { combineReducers } from "redux";

import appSlice from "../appSlice";
import authentication from "../containers/auth/slice";
import createPlaylist from "../containers/createPlaylist/slice";

const rootReducer = combineReducers({
  appSlice,
  authentication,
  createPlaylist,
});

export default rootReducer;
