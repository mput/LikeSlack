import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const channels = handleActions(
  {
    [actions.addChannel]: (state, { payload }) => {
      const { data: { id, attributes } } = payload;
      return {
        byId: { ...state.byId, [id]: { ...attributes, id } },
        allIds: [...state.allIds, id],
      };
    },
    [actions.removeChannel]: (state, { payload }) => {
      const { data: { id } } = payload;
      const { byId, allIds } = state;
      return {
        byId: _.omitBy(byId, id),
        allIds: allIds.filter(currentId => currentId !== id),
      };
    },
    [actions.renameChannel]: (state, { payload }) => {
      const { byId, allIds } = state;
      const { data: { attributes: { id, name } } } = payload;
      const changedChannel = { ...byId[id], name };
      return {
        byId: { ...byId, [id]: changedChannel },
        allIds,
      };
    },
  },
  { byId: {}, allId: [] },
);

const messages = handleActions(
  {
    [actions.addMessage]: (state, { payload }) => {
      const { data: { attributes: newMessage } } = payload;
      const newMessageId = newMessage.id;
      return {
        byId: { ...state.byId, [newMessageId]: newMessage },
        allIds: [...state.allIds, newMessageId],
      };
    },
    [actions.removeChannel]: (state, { payload }) => {
      const { data: { id: removedChannelId } } = payload;
      const { byId, allIds } = state;
      const filteredById = _.omitBy(byId, message => message.channelId === removedChannelId);
      const filteredAllIds = allIds.filter(messageId => filteredById[messageId]);
      return {
        byId: filteredById,
        allIds: filteredAllIds,
      };
    },
  },
  { byId: {}, allId: [] },
);

const activeChannelId = handleActions(
  {
    [actions.setActiveCahnnel]: (state, { payload: newActiveId }) => (
      { ...state, activeId: newActiveId }
    ),
    [actions.removeChannel]: (state, { payload }) => {
      const { data: { id } } = payload;
      return state.activeId === id ? { activeId: state.defaultActiveId } : state;
    },
  },
  { activeId: null, defaultActiveId: null },
);

const modalDefault = {
  isShown: false,
  type: 'none',
  status: 'none',
  data: {},
};
const modal = handleActions(
  {
    [actions.showModal]: (state, { payload }) => {
      const { type, data } = payload;
      return {
        ...state,
        isShown: true,
        type,
        data,
      };
    },
    [actions.hideModal]: () => (modalDefault),
    [actions.requestModalAction]: state => ({ ...state, status: 'requested' }),
    [actions.failureModalAction]: state => ({ ...state, status: 'failed' }),
  },
  modalDefault,
);

const isAddChannelFormShown = handleActions(
  {
    [actions.toggleAddChannelFormVisibility]: state => !state,
  },
  false,
);

export default combineReducers({
  channels,
  messages,
  activeChannelId,
  modal,
  isAddChannelFormShown,
  form: formReducer,
});
