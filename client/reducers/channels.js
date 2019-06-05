import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _ from 'lodash';
import { channelsActions, uiActions } from '../actions/actionCreators';
import {
  addEntitiesById,
  addEntitiesAllIds,
  deleteEntityById,
  deleteEntityAllId,
  updateEntityById,
} from '../lib/reducerBuilder';

const byId = handleActions(
  {
    [channelsActions.add.success]: addEntitiesById('channels'),
    [channelsActions.delete.success]: deleteEntityById(),
    [channelsActions.update.success]: updateEntityById('channels'),
  },
  {},
);

const allIds = handleActions(
  {
    [channelsActions.add.success]: addEntitiesAllIds(),
    [channelsActions.delete.success]: deleteEntityAllId(),
  },
  [],
);

const UIbyId = handleActions(
  {
    [channelsActions.add.success]: (state, action) => {
      const isInit = _.isEmpty(state);
      const { payload: { entities } } = action;
      const { channels } = entities;
      const newUiStateById = Object.keys(channels).reduce((acc, key) => {
        const defaultActive = channels[key].default;
        const active = isInit && defaultActive;
        const unread = 0;
        return { ...acc, [key]: { active, unread, defaultActive } };
      }, {});
      return { ...state, ...newUiStateById };
    },
    [uiActions.setActiveChannel]: (state, { payload: nextActiveId }) => {
      const nowActiveId = _.findKey(state, ({ active }) => !!active);
      return {
        ...state,
        [nowActiveId]: { ...state[nowActiveId], active: false },
        [nextActiveId]: { ...state[nextActiveId], active: true },
      };
    },
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
