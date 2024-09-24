import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ErrorPayload, RequestStatus } from "../../types/requests";

const SPOTIFY_SCOPE = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
];

const REDIRECT_URI = window.location.origin;

export interface User {
  userId?: string;
  userName?: string;
  userImage?: string;
}

export interface AuthState {
  accessToken?: string;
  user?: User;
  status: RequestStatus;
  error?: string;
}

export interface AccessTokenPayload {
  accessToken: string;
}

const initialState: AuthState = {
  status: RequestStatus.IDLE,
};

// Create actions
export const getUser = createAction("auth/getUser");
export const getUserSuccess = createAction<User>("auth/getUserSuccess");
export const getUserFailed = createAction<ErrorPayload>(
  "auth/getUserFailed"
);

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login() {
      const { REACT_APP_SPOTIFY_CLIENT_ID } = process.env;
      const scopes: string = SPOTIFY_SCOPE.join(",");

      window.location.href = `https://accounts.spotify.com/me/authorize?client_id=${REACT_APP_SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}`;
    },
    setAccessToken(state, action: PayloadAction<AccessTokenPayload>) {
      state.accessToken = action.payload.accessToken;
      window.history.pushState({ REDIRECT_URI }, "", REDIRECT_URI);
    },
    logOut(state) {
      const { REACT_APP_BASE_URL } = process.env;
      // Remove cookies
      const deleteCookie = (cookieName: string, domain: string, path: string = '/') => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
      };

      // Delete cookies by specifying the domain and path
      deleteCookie('sp_dc', '.spotify.com', '/');
      deleteCookie('sp_key', '.spotify.com', '/');
      deleteCookie('sp_landing', '.spotify.com', '/');
      deleteCookie('sp_t', '.spotify.com', '/');
      state.accessToken = undefined;
      state.user = undefined;
      state.status = RequestStatus.IDLE;

      // Redirect back to your app after logout
      window.location.href = `${REACT_APP_BASE_URL}`;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser, (state) => {
        state.status = RequestStatus.PENDING;
      })
      .addCase(getUserSuccess, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.user = action.payload;
      })
      .addCase(getUserFailed, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload.message;
      });
  },
});

export const { login, setAccessToken, logOut } = authSlice.actions;

export default authSlice.reducer;
