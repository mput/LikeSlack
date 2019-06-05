import { createActions } from 'redux-actions';
import { identity } from 'lodash';

import * as normalizers from '../lib/normalizers';


export const channelsActions = createActions(
  {
    FETCH: {
      START: identity,
      SUCCESS: data => normalizers.channels(data),
      ERROR: identity,
    },
    DELETE: {
      START: identity,
      SUCCESS: identity,
      ERROR: identity,
    },
    UPDATE: {
      START: identity,
      SUCCESS: data => normalizers.channels(data),
      ERROR: identity,
    },
    CREATE: {
      START: identity,
      SUCCESS: identity,
      ERROR: identity,
    },
  },
  {
    prefix: 'CHANNELS',
  },
);

export const usersActions = createActions(
  {
    FETCH: {
      SUCCESS: data => normalizers.users(data),
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
  { prefix: 'UI' },
);

export const modalWindowActions = createActions(
  'SHOW',
  'HIDE',
  'START',
  'ERROR',
  { prefix: 'MODAL_WINDOW' },
);
