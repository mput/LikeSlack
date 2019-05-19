import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const userMeId = handleActions(
  {
    [actions.logIn]: (_state, { payload: id }) => id,
    [actions.logOut]: () => null,
  },
  null,
);

const activeChannelId = handleActions(
  {
    [actions.setActiveChannel]: (state, { payload: newActiveId }) => (
      { ...state, activeId: newActiveId }
    ),
    [actions.removeChannel]: (state, { payload }) => {
      const { data: { id } } = payload;
      return state.activeId === id ? { activeId: state.defaultActiveId } : state;
    },
  },
  { activeId: null, defaultActiveId: null },
);


const isAddChannelFormShown = handleActions(
  {
    [actions.toggleAddChannelFormVisibility]: state => !state,
  },
  false,
);

const modalDefault = {
  isShown: false,
  type: 'none',
  status: 'none',
  data: {},
};
const modal = handleActions(
  {
    [actions.showModal]: (state, { payload }) => {
      const { type, data } = payload;
      return {
        ...state,
        isShown: true,
        type,
        data,
      };
    },
    [actions.hideModal]: () => (modalDefault),
    [actions.requestModalAction]: state => ({ ...state, status: 'requested' }),
    [actions.failureModalAction]: state => ({ ...state, status: 'failed' }),
  },
  modalDefault,
);

export default combineReducers({
  userMeId,
  activeChannelId,
  isAddChannelFormShown,
  modal,
});
