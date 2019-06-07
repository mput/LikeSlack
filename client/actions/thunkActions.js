import axios from 'axios';
import * as routes from '../routes';
import logger from '../../server/lib/logger';
import handleTokens from '../lib/handleTokens';
import {
  channelsActions,
  authActions,
  usersActions,
  initAppActions,
  modalWindowActions,
  messagesActions,
  uiActions,
} from './actionCreators';

const log = logger('thunkActions');

// CHANNELS
export const fetchChannels = () => async (dispatch) => {
  dispatch(channelsActions.fetch.start());
  try {
    const { data } = await axios.get(routes.channels());
    dispatch(channelsActions.fetch.success(data));
  } catch (err) {
    log(err);
    dispatch(channelsActions.fetch.error());
    throw err;
  }
};

const removeChannel = channelId => async (dispatch) => {
  const url = routes.channel(channelId);
  try {
    log('Sending delete channel request to %s', url);
    await axios.delete(url);
    dispatch(channelsActions.delete.success(channelId));
  } catch (err) {
    log('Error while deleting channel', err);
    throw err;
  }
};

const renameChannel = (id, name) => async (dispatch) => {
  const url = routes.channel(id);
  const data = { name };
  try {
    log('Sending rename channel request to %s', url);
    const { data: responseData } = await axios.patch(url, data);
    dispatch(channelsActions.update.success(responseData));
  } catch (err) {
    log('Error while renaming channel', err);
    throw err;
  }
};

const addChannel = name => async (dispatch) => {
  const url = routes.channels();
  const data = { name };
  try {
    log('Sending crate channel request to %s', url);
    const { data: newChannel } = await axios.post(url, data);
    dispatch(channelsActions.add.success(newChannel));
    dispatch(uiActions.setActiveChannel(newChannel.id));
  } catch (err) {
    log('Error while renaming channel', err);
    throw err;
  }
};


// MESSAGES

export const loadNextMessagesAction = channelId => async (dispatch) => {
  dispatch(messagesActions.fetch.start(channelId));
  const url = routes.messages(channelId);
  try {
    const { data } = await axios.get(url);
    log('Messages received: ', data);
    dispatch(messagesActions.fetch.success(data));
  } catch (err) {
    log('Error while loading messages frm %s', url, err);
    dispatch(messagesActions.error.success(data));
    throw err;
  }
};

export const sendMessageAction = (message, channelId) => async (dispatch) => {
  const url = routes.messages(channelId);
  const data = { message };
  log('Sending message to %s', url);
  const { data: responseData } = await axios.post(url, data);
  dispatch(messagesActions.add.success(responseData));
};

// MODAL
const modalActionWrapper = action => (...params) => async (dispatch) => {
  dispatch(modalWindowActions.start());
  try {
    await dispatch(action(...params));
    dispatch(modalWindowActions.hide());
  } catch (err) {
    dispatch(modalWindowActions.error());
  }
};

export const removeChannelInModal = modalActionWrapper(removeChannel);
export const renameChannelInModal = modalActionWrapper(renameChannel);
export const addChannelInModal = modalActionWrapper(addChannel);

// AUTH
export const logIn = () => async (dispatch) => {
  if (!handleTokens.getTokens()) {
    log('No tokens in local store');
    return;
  }
  try {
    const { data } = await axios.get(routes.userMe());
    const { id } = data;
    dispatch(usersActions.add.success(data));
    log('Added new user to store');
    dispatch(authActions.login(id));
    log('Login as a user with ID %s', id);
  } catch (err) {
    log('Can\'t fetch self user', err);
    log('Err status is: ', err.status);
    if (err.status === 403) {
      handleTokens.removeTokens();
      log('Invalid refresh token, deleting tokens from store');
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

// INIT
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
