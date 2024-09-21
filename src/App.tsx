import './styles/App.css';

import React, { FC, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authSelectors } from "./containers/auth/selectors";

const App: FC = (): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);

  // TODO: You can access user data and now fetch user's playlists
  console.log(user);

  return (
    <>
      <div className='header-container'>
        <div className='serach'>
          <input type='text' placeholder='Search for a song' />
          <button className='button'>Search</button>
        </div>
        <button className='button'>Add a new playlist</button >
      </div>
    </>
  );
};

export default App;
