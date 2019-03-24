import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import gon from 'gon';
import Cookies from 'js-cookie';
import faker from 'faker';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import _ from 'lodash';

import reducers from './reducers';
import logger from '../lib/logger';
import ChatApp from './components/ChatApp';

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
    channels: prepareData(channels),
    messages: prepareData(messages),
  },
  composeWithDevTools(applyMiddleware(thunk)),
);
const userName = getOrGenerateName();

ReactDOM.render(
  <Provider store={store}>
    <ChatApp userName={userName} />
  </Provider>,
  document.getElementById('chatApp'),
);
