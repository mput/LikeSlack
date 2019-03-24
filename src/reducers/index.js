import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const channels = handleActions(
  {
    [actions.addChannel]: state => ({ state }),
  },
  { byId: {}, allId: [] },
);

const messages = handleActions(
  {
    [actions.addMessage]: (state, { payload: newMessage }) => {
      const newMessageId = newMessage.id;
      if (state[newMessageId]) {
        return state;
      }
      return {
        byId: { ...state.byId, [newMessageId]: newMessage },
        allIds: [...state.allIds, newMessageId],
      };
    },
  },
  { byId: {}, allId: [] },
);

const activeChannelId = handleActions(
  {
    [actions.setActiveCahnnel]: state => ({ state }),
  },
  1,
);

export default combineReducers({
  channels,
  messages,
  activeChannelId,
  form: formReducer,
});
