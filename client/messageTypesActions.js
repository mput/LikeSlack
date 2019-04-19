import * as actions from './actions';

export default {
  newMessage: actions.addMessage,
  newChannel: actions.addChannel,
  removeChannel: actions.removeChannel,
  renameChannel: actions.renameChannel,
};
