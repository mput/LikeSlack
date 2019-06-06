import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { messagesActions } from '../actions/actionCreators';
import {
  addEntitiesById,
  addEntitiesAllIds,
} from '../lib/reducerBuilder';

const byId = handleActions(
  {
    [messagesActions.add.success]: addEntitiesById('channels'),
  },
  {},
);

const allIds = handleActions(
  {
    [messagesActions.add.success]: addEntitiesAllIds(),
  },
  [],
);

export default combineReducers({
  byId,
  allIds,
});
