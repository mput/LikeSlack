import { createAction } from 'redux-actions';
import axios from 'axios';

import * as routes from '../routes';
import logger from '../../server/lib/logger';
import handleTokens from '../lib/handleTokens';

const log = logger('actions');

export const addMessage = createAction('MESSAGE_ADD');
export const sendMessageRequest = (message, author, channelId) => async () => {
  const url = routes.messages(channelId);
  const data = {
    attributes: { message, author, channelId },
  };
  log('Sending message to %s', url);
  await axios.post(url, { data });
};

export const setActiveChannel = createAction('ACTIVE_CHANNEL_SET');
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


export const addUser = createAction('USER_ADD');

export const logIn = createAction('AUTH_LOGIN');
export const logOut = createAction('AUTH_LOGOUT');

export const addUserMeRequest = () => async (dispatch, getState) => {
  const { data } = await axios.get(routes.userMe());
  const { data: { id } } = data;
  log(data, id);
  log('Login as a user with ID %s', id);
  if (!getState().users.byId[id]) {
    dispatch(addUser(data));
    log('Added new user to store');
  }
  dispatch(logIn(id));
};

export const authenticate = () => async (dispatch) => {
  const successAuthCallback = (tokens) => {
    log('Tokens recived %O', tokens);
    handleTokens.saveTokens(tokens);
    dispatch(addUserMeRequest());
  };
  window.successAuthCallback = successAuthCallback;
  window.open(routes.login('github'));
};

export const logOutRequest = () => async (dispatch) => {
  try {
    await axios.get(routes.logout(), {
      withAccessToken: false,
      withRefreshToken: true,
    });
  } finally {
    handleTokens.removeTokens();
    dispatch(logOut());
  }
};

export const initState = () => async (dispatch) => {
  if (handleTokens.getTokens()) {
    dispatch(addUserMeRequest());
    return;
  }
  dispatch(logOut());
};
