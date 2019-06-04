import { createActions } from 'redux-actions';
import * as normalizers from '../lib/normalizers';


export const channelsActions = createActions(
  {
    FETCH: {
      START: null,
      SUCCESS: data => normalizers.channels(data),
      ERROR: null,
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
