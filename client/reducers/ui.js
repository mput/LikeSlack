import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions/__index';
import { modalWindowActions } from '../actions/actionCreators';


const modalDefault = {
  isShown: false,
  type: 'none',
  status: 'none', // 'requested', 'failed'
  data: {},
};
const modal = handleActions(
  {
    [modalWindowActions.show]: (state, { payload }) => {
      const { type, data } = payload;
      return {
        ...state,
        isShown: true,
        type,
        data,
      };
    },
    [modalWindowActions.hide]: () => (modalDefault),
    [modalWindowActions.start]: state => ({ ...state, status: 'requested' }),
    [modalWindowActions.error]: state => ({ ...state, status: 'failed' }),
  },
  modalDefault,
);

const isAddChannelFormShown = handleActions(
  {
    [actions.toggleAddChannelFormVisibility]: state => !state,
  },
  false,
);

export default combineReducers({
  isAddChannelFormShown,
  modal,
});
