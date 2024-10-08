import React, { FC, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authSelectors } from "./selectors";
import { getUser, login, setAccessToken } from "./slice";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(authSelectors.getAccessToken);

  const { location } = window;
  const regex = /.*access_token=(?<accesToken>[^&]*)/gi; // The regex with named capturing groups requires at least ES2018. So I updated the tsconfig.json file to target "es2018" or later instead of "es5"
  const params = regex.exec(location.hash);

  if (!accessToken && params == null) {
    dispatch(login());
  }

  useEffect(() => {
    if (!accessToken && params?.[1]) {
      dispatch(setAccessToken({ accessToken: params[1] }));
    }
  }, []);

  useEffect(() => {
    if (accessToken != null) {
      dispatch(getUser());
    }
  }, [accessToken]);

  return <>{children}</>;
};

export default AuthProvider;
