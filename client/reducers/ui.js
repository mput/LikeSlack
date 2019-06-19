import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { modalWindowActions, authActions } from '../actions/actionCreators';


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

const meId = handleActions(
  {
    [authActions.login]: (_state, { payload: id }) => id,
    [authActions.logout]: () => null,
  },
  null,
);

export default combineReducers({
  modal,
  meId,
});
