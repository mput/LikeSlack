import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import gon from 'gon';
import Cookies from 'js-cookie';
import faker from 'faker';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import _ from 'lodash';

import reducers from './reducers';
import ChatApp from './components/ChatApp';
import messageTypesActions from './messageTypesActions';
import logger from '../server/lib/logger';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/application.css';

const log = logger('init');
if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}


const getOrGenerateName = () => {
  const exitsingUserName = Cookies.get('userName');
  if (exitsingUserName) {
    log(`Name for session (${exitsingUserName}) taken from cookies`);
    return exitsingUserName;
  }
  const newUserName = faker.internet.userName();
  Cookies.set('userName', newUserName);
  log(`Name for session (${newUserName}) saved into cookies`);
  return newUserName;
};
const prepareData = entrys => ({
  byId: _.keyBy(entrys, ({ id }) => id),
  allIds: entrys.map(({ id }) => id),
});

const { channels, messages } = gon;

const store = createStore(
  reducers,
  {
    channels: prepareData(channels
      .map(ch => ({ ...ch, id: String(ch.id) }))),
    messages: prepareData(messages
      .map(msg => ({ ...msg, id: String(msg.id), channelId: String(msg.channelId) }))),
    activeChannelId: { activeId: String(channels[0].id), defaultActiveId: String(channels[0].id) },
  },
  composeWithDevTools(applyMiddleware(thunk)),
);

const socket = io();

Object.keys(messageTypesActions).forEach((type) => {
  const action = messageTypesActions[type];
  socket.on(type, (payload) => {
    log('New event (%s) on socket: %o', type, payload);
    store.dispatch(action(payload));
  });
});

const userName = getOrGenerateName();
ReactDOM.render(
  <Provider store={store}>
    <ChatApp userName={userName} />
  </Provider>,
  document.getElementById('chatApp'),
);
