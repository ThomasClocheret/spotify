import reducer, { createPlaylistSuccess, createPlaylistFailure, resetCreatePlaylistState } from '../containers/createPlaylist/slice';
import { RequestStatus } from '../types/requests';
import { Playlist } from '../types/spotify';

describe('createPlaylist reducer', () => {
  const initialState = {
    playlists: [],
    status: RequestStatus.IDLE,
    error: undefined,
  };

  it('should handle createPlaylistSuccess', () => {
    const newPlaylist: Playlist = {
      id: '1',
      name: 'New Playlist',
      description: 'A new playlist',
      images: [],
    };
    const state = reducer(initialState, createPlaylistSuccess(newPlaylist));
    expect(state.playlists).toContainEqual(newPlaylist);
    expect(state.status).toEqual(RequestStatus.SUCCESS);
  });

  it('should handle createPlaylistFailure', () => {
    const errorMessage = 'Error creating playlist';
    const state = reducer(initialState, createPlaylistFailure(errorMessage));
    expect(state.error).toEqual(errorMessage);
    expect(state.status).toEqual(RequestStatus.ERROR);
  });

  it('should handle resetCreatePlaylistState', () => {
    const modifiedState = { ...initialState, status: RequestStatus.SUCCESS };
    const state = reducer(modifiedState, resetCreatePlaylistState());
    expect(state).toEqual(initialState);
  });
});
