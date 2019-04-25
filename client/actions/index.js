import { createAction } from 'redux-actions';
import axios from 'axios';
import * as routes from '../routes';
import logger from '../../lib/logger';

const log = logger('actions');

export const addMessage = createAction('MESSAGE_ADD');
export const sendMessageRequest = (message, author, channelId) => async () => {
  const url = routes.messages(channelId);
  const data = {
    attributes: {
      message, author,
    },
  };
  log('Sending message to %s', url);
  await axios.post(url, { data });
};

export const setActiveCahnnel = createAction('ACTIVE_CHANNEL_SET');

export const toggleAddChannelFormVisibility = createAction('ADD_CHANNEL_TOGGLE_VISIBILITY');

export const addChannel = createAction('CHANNEL_ADD');
export const addChannelRequset = name => async (dispatch) => {
  const url = routes.channels();
  const data = {
    type: 'channel',
    attributes: {
      name,
    },
  };
  log('Sending new channel name to %s', url);
  await axios.post(url, { data });
  dispatch(toggleAddChannelFormVisibility());
};


export const showModal = createAction('MODAL_SHOW');
export const hideModal = createAction('MODAL_HIDE');
export const requestModalAction = createAction('MODAL_REQUEST');
export const failureModalAction = createAction('MODAL_FAILURE');

export const removeChannel = createAction('CHANNEL_REMOVE');
export const removeChannelRequest = channelId => async (dispatch) => {
  const url = routes.channel(channelId);
  dispatch(requestModalAction());
  try {
    log('Sending delete channel request to %s', url);
    await axios.delete(url);
    dispatch(hideModal());
  } catch (err) {
    dispatch(failureModalAction());
    throw err;
  }
};


export const renameChannel = createAction('CHANNEL_RENAME');
export const renameChannelRequest = (id, name) => async (dispatch) => {
  const url = routes.channel(id);
  const data = {
    data: {
      attributes: {
        name,
      },
    },
  };
  dispatch(requestModalAction());
  try {
    log('Sending rename channel request to %s', url);
    await axios.patch(url, data);
    dispatch(hideModal());
  } catch (err) {
    dispatch(failureModalAction());
    throw err;
  }
};
