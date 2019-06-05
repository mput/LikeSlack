import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _ from 'lodash';
import { addEntitiesById, addEntitiesAllIds } from '../lib/reducerBuilder';
import { channelsActions, uiActions } from '../actions/actionCreators';

const byId = handleActions(
  {
    [channelsActions.fetch.success]: addEntitiesById('channels'),
  },
  {},
);

const allIds = handleActions(
  {
    [channelsActions.fetch.success]: addEntitiesAllIds(),
  },
  [],
);

const UIbyId = handleActions(
  {
    [channelsActions.fetch.success]: (state, action) => {
      const isInit = _.isEmpty(state);
      const { payload: { entities } } = action;
      const { channels } = entities;
      const newUiStateById = Object.keys(channels).reduce((acc, key) => {
        const active = isInit && channels[key].default;
        const unread = 0;
        return { ...acc, [key]: { active, unread } };
      }, {});
      return newUiStateById;
    },
    [uiActions.setActiveChannel]: (state, { payload: nextActiveId }) => {
      const nowActiveId = _.findKey(state, ({ active }) => !!active);
      return {
        ...state,
        [nowActiveId]: { ...state[nowActiveId], active: false },
        [nextActiveId]: { ...state[nextActiveId], active: true },
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

//   [actions.removeChannel]: (state, { payload }) => {
//     const { data: { id } } = payload;
//     const { byId, allIds } = state;
//     return {
//       byId: _.omitBy(byId, id),
//       allIds: allIds.filter(currentId => currentId !== id),
//     };
//   },
//   [actions.renameChannel]: (state, { payload }) => {
//     const { byId, allIds } = state;
//     const { data: { id, attributes: { name } } } = payload;
//     const changedChannel = { ...byId[id], name };
//     return {
//       byId: { ...byId, [id]: changedChannel },
//       allIds,
//     };
//   },
