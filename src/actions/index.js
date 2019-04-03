import { createAction } from 'redux-actions';
import axios from 'axios';
import * as routes from '../routes';
import logger from '../../lib/logger';

const log = logger('actions');

export const addMessage = createAction('ADD_MESSAGE');
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

export const addChannel = createAction('CHANNEL_ADD');
export const addChannelRequset = name => async () => {
  const url = routes.channels();
  const data = {
    attributes: {
      name,
    },
  };
  log('Sending new channel name to %s', url);
  await axios.post(url, { data });
};


export const showModal = createAction('MODAL_SHOW');
export const hideModal = createAction('MODAL_HIDE');
export const modalActionRequest = createAction('MODAL_REQUEST');
export const modalActionFailure = createAction('MODAL_FAILURE');

export const removeChannel = createAction('CHANNEL_REMOVE');
export const removeChannelRequest = channelId => async (dispatch) => {
  const url = routes.channel(channelId);
  dispatch(modalActionRequest());
  try {
    log('Sending delete channel request to %s', url);
    await axios.delete(url);
    dispatch(hideModal());
  } catch (err) {
    dispatch(modalActionFailure());
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
  dispatch(modalActionRequest());
  try {
    log('Sending rename channel request to %s', url);
    await axios.patch(url, data);
    dispatch(hideModal());
  } catch (err) {
    dispatch(modalActionFailure());
    throw err;
  }
};
