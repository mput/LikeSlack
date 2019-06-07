import { handleActions } from 'redux-actions';
import { usersActions, messagesActions } from '../actions/actionCreators';
import { addEntitiesById } from '../lib/reducerBuilder';

export default handleActions(
  {
    [usersActions.add.success]: addEntitiesById('users'),
    [messagesActions.add.success]: addEntitiesById('users'),
    [messagesActions.fetch.success]: addEntitiesById('users'),
  },
  {},
);
