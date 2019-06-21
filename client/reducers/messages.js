import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _ from 'lodash';
import { messagesActions, channelsActions } from '../actions/actionCreators';
import { addEntitiesById } from '../lib/reducerBuilder';

const byId = handleActions(
  {
    [messagesActions.add.success]: addEntitiesById('messages'),
    [messagesActions.fetch.success]: addEntitiesById('messages'),
    [channelsActions.delete.success]: (state, { payload }) => {
      const { id: channelIdToDelete } = payload;
      return _.omitBy(state, ({ channelId }) => channelId === channelIdToDelete);
    },
  },
  {},
);

export default combineReducers({
  byId,
});
