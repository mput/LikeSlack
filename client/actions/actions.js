import { createActions } from 'redux-actions';
import axios from 'axios';
import * as routes from '../routes';
import logger from '../../server/lib/logger';
import handleTokens from '../lib/handleTokens';
import * as normalizers from '../lib/normalizers';

const log = logger('actions');


export const channelsActions = createActions(
  {
    FETCH: {
      START: null,
      SUCCESS: ({ data }) => normalizers.channel(data),
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
      SUCCESS: response => response.data,
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

export const fetchChannels = () => async (dispatch) => {
  dispatch(channelsActions.fetch.start());
  try {
    const data = await axios.get(routes.channel(1));
    log(data);
    dispatch(channelsActions.fetch.success(data));
  } catch (err) {
    log(err);
    dispatch(channelsActions.fetch.error());
    throw err;
  }
};

export const logIn = () => async (dispatch) => {
  if (!handleTokens.getTokens()) {
    log('No tokens in local store');
    return;
  }
  try {
    const response = await axios.get(routes.userMe());
    const { data: { id } } = response;
    log('Login as a user with ID %s', id);
    dispatch(usersActions.fetch.success(response));
    log('Added new user to store');
    dispatch(authActions.login(id));
  } catch (err) {
    log('Can\'t fetch self user', err);
    log('Err status is: ', err.status);
    if (err.status === 403) {
      handleTokens.removeTokens();
      log('Invalid refresh token');
      return;
    }
    throw err;
  }
};

export const logOut = () => async (dispatch) => {
  try {
    await axios.get(routes.logout(), {
      withAccessToken: false,
      withRefreshToken: true,
    });
  } finally {
    handleTokens.removeTokens();
    dispatch(authActions.logout());
  }
};

export const authenticate = (authProvider = 'github') => async (dispatch) => {
  const successAuthCallback = (tokens) => {
    log('Tokens received %O', tokens);
    handleTokens.saveTokens(tokens);
    dispatch(logIn());
  };
  window.successAuthCallback = successAuthCallback;
  window.open(routes.login(authProvider));
};


export const initApp = () => async (dispatch) => {
  dispatch(initAppActions.start());
  try {
    await Promise.all([
      dispatch(logIn()),
      dispatch(fetchChannels()),
    ]);
  } catch (err) {
    log(err);
    dispatch(initAppActions.error());
    return;
  }
  dispatch(initAppActions.success());
};
