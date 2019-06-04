import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import { authActions } from '../actions/actionCreators';


import channels from './channels';
import messages from './messages';
import users from './users';
import ui from './ui';

const meId = handleActions(
  {
    [authActions.login]: (_state, { payload: id }) => id,
    [authActions.logout]: () => null,
  },
  null,
);

export default combineReducers({
  channels,
  messages,
  users,
  meId,
  ui,
  form: formReducer,
});
