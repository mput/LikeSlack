import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import ChatApp from './components/ChatApp';
import messageTypesActions from './messageTypesActions';
import logger from '../server/lib/logger';
import initAxiosIntercepter from './lib/axiosIntercepter';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/application.css';

const log = logger('init');

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk)),
);
initAxiosIntercepter(store);

const socket = io();

Object.keys(messageTypesActions).forEach((type) => {
  const action = messageTypesActions[type];
  socket.on(type, (payload) => {
    log('New event (%s) on socket: %o', type, payload);
    store.dispatch(action(payload));
  });
});

ReactDOM.render(
  <Provider store={store}>
    <ChatApp />
  </Provider>,
  document.getElementById('chatApp'),
);
