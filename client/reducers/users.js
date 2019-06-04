import { handleActions } from 'redux-actions';
import { usersActions } from '../actions/actionCreators';
import { addEntitiesById } from '../lib/reducerBuilder';

export default handleActions(
  {
    [usersActions.fetch.success]: addEntitiesById('users'),
  },
  {},
);
