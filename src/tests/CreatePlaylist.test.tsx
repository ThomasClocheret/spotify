// src/tests/CreatePlaylist.test.tsx

import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, fireEvent } from '@testing-library/react';

import CreatePlaylist from '../containers/createPlaylist/CreatePlaylist';
import { RequestStatus } from '../types/requests';

const mockStore = configureStore([]);

describe('CreatePlaylist component', () => {
  let store: any;
  let onCancel: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      createPlaylist: {
        status: RequestStatus.IDLE,
        error: null,
      },
    });
    store.dispatch = jest.fn();
    onCancel = jest.fn();
  });

  it('renders and allows input', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <CreatePlaylist onCancel={onCancel} />
      </Provider>
    );

    const nameInput = getByPlaceholderText('Playlist name') as HTMLInputElement;
    const descriptionInput = getByPlaceholderText('Playlist description (optional)') as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'My Playlist' } });
    expect(nameInput.value).toBe('My Playlist');

    fireEvent.change(descriptionInput, { target: { value: 'A cool playlist' } });
    expect(descriptionInput.value).toBe('A cool playlist');

    const saveButton = getByText('Save');
    fireEvent.click(saveButton);

    expect(store.dispatch).toHaveBeenCalled();
  });
});