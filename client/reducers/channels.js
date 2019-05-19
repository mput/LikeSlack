import { handleActions } from 'redux-actions';
import _ from 'lodash';
import * as actions from '../actions';

export default handleActions(
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
      const { data: { id, attributes: { name } } } = payload;
      const changedChannel = { ...byId[id], name };
      return {
        byId: { ...byId, [id]: changedChannel },
        allIds,
      };
    },
  },
  { byId: {}, allId: [] },
);
