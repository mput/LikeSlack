import { createAction } from 'redux-actions';
import axios from 'axios';
import * as routes from '../routes';
import logger from '../../lib/logger';

const log = logger('actions');

export const addChannel = createAction('CHANNEL_ADD');
export const removeChannel = createAction('CHANNEL_REMOVE');
export const removeChannelRequest = createAction('CHANNEL_REMOVE_REQUEST');
export const removeChannelFailure = createAction('CHANNEL_REMOVE_FAILURE');

export const addMessage = createAction('ADD_MESSAGE');

export const setActiveCahnnel = createAction('ACTIVE_CHANNEL_SET');

export const showModal = createAction('MODAL_SHOW');
export const hideModal = createAction('MODAL_HIDE');


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
  } catch (err) {
    dispatch(removeChannelFailure());
    throw err;
  }
};
