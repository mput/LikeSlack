import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const channels = handleActions(
  {
    [actions.addChannel]: state => ({ state }),
  },
  { byId: {}, allId: [] },
);

const messages = handleActions(
  {
    [actions.addMessage]: state => ({ state }),
  },
  { byId: {}, allId: [] },
);

const activeChannelId = handleActions(
  {
    [actions.setActiveCahnnel]: state => ({ state }),
  },
  1,
);

export default combineReducers({ channels, messages, activeChannelId });
