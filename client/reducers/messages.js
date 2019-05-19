import { handleActions } from 'redux-actions';
import _ from 'lodash';
import * as actions from '../actions';

export default handleActions(
  {
    [actions.addMessage]: (state, { payload }) => {
      const { data: { id, attributes: newMessage } } = payload;
      return {
        byId: { ...state.byId, [id]: newMessage },
        allIds: [...state.allIds, id],
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
