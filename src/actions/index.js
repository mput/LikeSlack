import { createAction } from 'redux-actions';
import axios from 'axios';
import * as routes from '../routes';
import logger from '../../lib/logger';

const log = logger('actions');

export const addChannel = createAction('ADD_CHANNEL');
export const removeChannel = createAction('REMOVE_CHANNEL');
export const removeChannelRequest = createAction('REMOVE_CHANNEL_REQUEST');
export const removeChannelFailed = createAction('REMOVE_CHANNEL_FAILED');

export const addMessage = createAction('ADD_MESSAGE');

export const setActiveCahnnel = createAction('SET_ACTIVE_CHANNEL');

export const showRemoveChannelModal = createAction('SHOW_REMOVE_CHANNEL_MODAL');
export const hideRemoveChannelModal = createAction('HIDE_REMOVE_CHANNEL_MODAL');


export const sendMessageRequest = (message, author, channelId) => async (dispatch) => {
  const url = routes.messages(channelId);
  const data = {
    attributes: {
      message, author,
    },
  };
  log('Sending message to %s', url);
  const { data: response } = await axios.post(url, { data });
  log('Message was sent, received data is %o', response);
  dispatch(addMessage(response));
};

export const addChannelRequset = (name, activate) => async (dispatch) => {
  const url = routes.channels();
  const data = {
    attributes: {
      name,
    },
  };
  log('Sending new channel name to %s', url);
  const { data: response } = await axios.post(url, { data });
  log('Channel was sent, received data is %o', response);
  dispatch(addChannel(response));
  if (activate) {
    const { data: { attributes: { id } } } = response;
    dispatch(setActiveCahnnel(id));
  }
};

export const deleteChannelRequst = channelId => async (dispatch) => {
  const url = routes.channel(channelId);
  log('Sending delete channel request to %s', url);
  dispatch(removeChannelRequest());
  try {
    await axios.delete(url);
    const data = { id: channelId };
    dispatch(removeChannel({ data }));
    dispatch(hideRemoveChannelModal());
  } catch {
    dispatch(removeChannelFailed());
  }
};
