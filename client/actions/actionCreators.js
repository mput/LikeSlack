import { createActions } from 'redux-actions';
import { identity } from 'lodash';

import normalizers from '../lib/normalizers';


export const channelsActions = createActions(
  {
    ADD: {
      START: identity,
      SUCCESS: data => normalizers.channel(data),
      ERROR: identity,
    },
    FETCH: {
      START: identity,
      SUCCESS: data => normalizers.channelList(data),
      ERROR: identity,
    },
    DELETE: {
      START: identity,
      SUCCESS: identity,
      ERROR: identity,
    },
    UPDATE: {
      START: identity,
      SUCCESS: data => normalizers.channel(data),
      ERROR: identity,
    },
  },
  {
    prefix: 'CHANNELS',
  },
);

export const messagesActions = createActions(
  {
    ADD: {
      START: identity,
      SUCCESS: data => normalizers.message(data),
      ERROR: identity,
    },
    FETCH: {
      START: channelId => ({ channelId }),
      SUCCESS: (data, channelId) => ({ ...normalizers.messageList(data), channelId }),
      ERROR: identity,
    },
  },
  {
    prefix: 'MESSAGES',
  },
);

export const usersActions = createActions(
  {
    ADD: {
      SUCCESS: data => normalizers.user(data),
    },
  },
  { prefix: 'USERS' },
);

export const initAppActions = createActions(
  'START',
  'SUCCESS',
  'ERROR',
  {
    prefix: 'INIT_APP',
  },
);

export const authActions = createActions(
  'LOGIN',
  'LOGOUT',
  { prefix: 'AUTH' },
);

export const uiActions = createActions(
  'SET_ACTIVE_CHANNEL',
  'SET_NO_MORE_HISTORY_CHANNEL',
  { prefix: 'UI' },
);

export const modalWindowActions = createActions(
  'SHOW',
  'HIDE',
  'START',
  'ERROR',
  { prefix: 'MODAL_WINDOW' },
);
