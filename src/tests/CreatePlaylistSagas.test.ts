import axios from 'axios';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { createPlaylistRequest, createPlaylistSuccess, createPlaylistFailure } from '../containers/createPlaylist/slice';
import createPlaylistSaga from '../containers/createPlaylist/createPlaylistSagas';
import { authSelectors } from '../containers/auth/selectors';
import { Playlist } from '../types/spotify';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('createPlaylistSaga', () => {
  const accessToken = 'testAccessToken';
  const userId = 'testUserId';

  const newPlaylistData = {
    name: 'Test Playlist',
    description: 'Test Description',
    public: true,
  };

  const newPlaylistResponse: Playlist = {
    id: '1',
    name: 'Test Playlist',
    description: 'Test Description',
    images: [],
  };

  it('creates a playlist successfully', () => {
    mockedAxios.post.mockResolvedValue({ data: newPlaylistResponse });

    return expectSaga(createPlaylistSaga)
      .provide([
        [matchers.select(authSelectors.getAccessToken), accessToken],
        [matchers.select(authSelectors.getUser), { userId }],
      ])
      .put(createPlaylistSuccess(newPlaylistResponse))
      .dispatch(createPlaylistRequest(newPlaylistData))
      .silentRun();
  });

  it('handles errors when creating a playlist', () => {
    const error = new Error('Failed to create playlist.');
    mockedAxios.post.mockRejectedValue(error);

    return expectSaga(createPlaylistSaga)
      .provide([
        [matchers.select(authSelectors.getAccessToken), accessToken],
        [matchers.select(authSelectors.getUser), { userId }],
      ])
      .put(createPlaylistFailure(error.message))
      .dispatch(createPlaylistRequest(newPlaylistData))
      .silentRun();
  });
});