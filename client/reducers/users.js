import { handleActions } from 'redux-actions';
import * as actions from '../actions';

export default handleActions(
  {
    [actions.addUser]: (state, { payload }) => {
      const { data } = payload;
      const { id, attributes } = data;
      return {
        byId: { ...state.byId, [id]: { ...attributes, id } },
        allIds: [...state.allIds, id],
      };
    },
  },
  { byId: {}, allIds: [] },
);
