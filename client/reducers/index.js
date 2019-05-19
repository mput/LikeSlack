import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import channels from './channels';
import messages from './messages';
import users from './users';
import ui from './ui';

export default combineReducers({
  channels,
  messages,
  users,
  ui,
  form: formReducer,
});
