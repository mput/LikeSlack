import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { messagesActions } from '../actions/actionCreators';
import {
  addEntitiesById,
  addEntitiesAllIds,
  addEntityAtBeginAllIds,
} from '../lib/reducerBuilder';

const byId = handleActions(
  {
    [messagesActions.add.success]: addEntitiesById('messages'),
    [messagesActions.fetch.success]: addEntitiesById('messages'),
  },
  {},
);

const allIds = handleActions(
  {
    [messagesActions.add.success]: addEntityAtBeginAllIds(),
    [messagesActions.fetch.success]: addEntitiesAllIds(),
  },
  [],
);

export default combineReducers({
  byId,
  allIds,
});
