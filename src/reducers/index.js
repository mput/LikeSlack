import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const channels = handleActions(
  {
    [actions.addChannel]: (state, { payload }) => {
      const { data: { attributes: newChannel } } = payload;
      const newChannelId = newChannel.id;
      if (state.byId[newChannelId]) {
        return state;
      }
      return {
        byId: { ...state.byId, [newChannelId]: newChannel },
        allIds: [...state.allIds, newChannelId],
      };
    },
    [actions.removeChannel]: (state, { payload }) => {
      const { data: { id } } = payload;
      const { byId, allIds } = state;
      if (byId[id] && byId[id].removable) {
        return {
          byId: _.omitBy(byId, id),
          allIds: allIds.filter(currentId => currentId !== id),
        };
      }
      return state;
    },
  },
  { byId: {}, allId: [] },
);

const messages = handleActions(
  {
    [actions.addMessage]: (state, { payload }) => {
      const { data: { attributes: newMessage } } = payload;
      const newMessageId = newMessage.id;
      if (state.byId[newMessageId]) {
        return state;
      }
      return {
        byId: { ...state.byId, [newMessageId]: newMessage },
        allIds: [...state.allIds, newMessageId],
      };
    },
  },
  { byId: {}, allId: [] },
);

const defaultChannelId = 1;
const activeChannelId = handleActions(
  {
    [actions.setActiveCahnnel]: (_state, { payload: channelId }) => (channelId),
    [actions.removeChannel]: (state, { payload }) => {
      const { data: { id } } = payload;
      return state === id ? defaultChannelId : state;
    },
  },
  defaultChannelId,
);

const removeChannelModalDefaultState = {
  modalShown: false,
  channelId: null,
  requested: false,
  failure: false,
};
const removeChannelModal = handleActions(
  {
    [actions.showRemoveChannelModal]: (state, { payload: channelId }) => ({
      ...state,
      modalShown: true,
      channelId,
    }),
    [actions.hideRemoveChannelModal]: () => (removeChannelModalDefaultState),
  },
  removeChannelModalDefaultState,
);

export default combineReducers({
  channels,
  messages,
  activeChannelId,
  removeChannelModal,
  form: formReducer,
});
