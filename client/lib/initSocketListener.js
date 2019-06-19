import io from 'socket.io-client';
import logger from '../../server/lib/logger';
import { messagesActions, channelsActions } from '../actions/actionCreators';

const log = logger('socketListener');

const msgTypeActions = {
  newMessage: messagesActions.add.success,
  newChannel: channelsActions.add.success,
  removeChannel: channelsActions.delete.success,
  renameChannel: channelsActions.update.success,
};

const socket = io();

export default (store, myId) => {
  Object.keys(msgTypeActions).forEach((type) => {
    const action = msgTypeActions[type];
    socket.on(type, ({ payload, meta }) => {
      log('New event (%s) on socket: %o', type, payload);
      if (meta && myId && meta.senderId === myId) {
        log('Ignore own message');
        return;
      }
      store.dispatch(action(payload));
    });
  });
};
