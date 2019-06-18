import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _ from 'lodash';
import { channelsActions, uiActions, messagesActions } from '../actions/actionCreators';
import {
  addEntitiesById,
  addEntitiesAllIds,
  addEntityAllIds,
  deleteEntityById,
  deleteEntityAllId,
  updateEntityById,
} from '../lib/reducerBuilder';

const byId = handleActions(
  {
    [channelsActions.fetch.success]: addEntitiesById('channels'),
    [channelsActions.add.success]: addEntitiesById('channels'),
    [channelsActions.delete.success]: deleteEntityById(),
    [channelsActions.update.success]: updateEntityById('channels'),
  },
  {},
);

const allIds = handleActions(
  {
    [channelsActions.fetch.success]: addEntitiesAllIds(),
    [channelsActions.add.success]: addEntityAllIds(),
    [channelsActions.delete.success]: deleteEntityAllId(),
  },
  [],
);

const initUIState = {
  active: false,
  defaultActive: false,
  unread: 0,
  loadingHistoryState: 'notLoading', // 'loading', 'failure'
  hasHistory: true,
  scrollPos: 0,
};
const UIbyId = handleActions(
  {
    [channelsActions.fetch.success]: (state, action) => {
      const isInit = _.isEmpty(state);
      const { payload: { entities } } = action;
      const { channels } = entities;
      const newUiStateById = Object.keys(channels).reduce((acc, key) => {
        const defaultActive = channels[key].default;
        const active = isInit && defaultActive;
        const unread = 0;
        const channelUIState = {
          ...initUIState,
          active,
          unread,
          defaultActive,
        };
        return { ...acc, [key]: channelUIState };
      }, {});
      return { ...state, ...newUiStateById };
    },
    [messagesActions.fetch.start]: (state, { payload: { channelId } }) => (
      {
        ...state,
        [channelId]: { ...state[channelId], loadingHistoryState: 'loading' },
      }
    ),
    [messagesActions.fetch.success]: (state, { payload: { channelId } }) => (
      {
        ...state,
        [channelId]: { ...state[channelId], loadingHistoryState: 'notLoading' },
      }
    ),
    [messagesActions.fetch.error]: (state, { payload: { channelId } }) => (
      {
        ...state,
        [channelId]: { ...state[channelId], loadingHistoryState: 'failure' },
      }
    ),
    [uiActions.setActiveChannel]: (state, { payload: nextActiveId }) => {
      const nowActiveId = _.findKey(state, ({ active }) => !!active);
      return {
        ...state,
        [nowActiveId]: { ...state[nowActiveId], active: false },
        [nextActiveId]: { ...state[nextActiveId], active: true },
      };
    },
    [uiActions.setNoMoreHistoryChannel]: (state, { payload: channelId }) => (
      {
        ...state,
        [channelId]: { ...state[channelId], hasHistory: false },
      }
    ),
    [channelsActions.delete.success]: (state, { payload: idToDel }) => {
      const omittedState = _.omit(state, String(idToDel));
      if (!state[idToDel].active) {
        return omittedState;
      }
      const defaultActiveId = _.findKey(state, ({ defaultActive }) => !!defaultActive);
      const activatedDefaultChannel = { ...state[defaultActiveId], active: true };
      return {
        ...omittedState,
        [defaultActiveId]: activatedDefaultChannel,
      };
    },
  },
  {},
);

export default combineReducers({
  byId,
  allIds,
  UIbyId,
});
