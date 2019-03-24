import { createAction } from 'redux-actions';
import axios from 'axios';
import * as routes from '../routes';
import logger from '../../lib/logger';

const log = logger('actions');

export const addChannel = createAction('ADD_CHANNEL');

export const addMessage = createAction('ADD_MESSAGE');

export const setActiveCahnnel = createAction('SET_ACTIVE_CHANNEL');


export const sendMessageRequest = (message, author, channelId) => async () => {
  const url = routes.messagesUrl(channelId);
  const data = {
    attributes: {
      message, author,
    },
  };
  log('Sending message to %s', url);
  const { data: newMessage } = await axios.post(url, { data });
  log('Message was sent, received data is %o', newMessage);
};
