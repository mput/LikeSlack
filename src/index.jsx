import React from 'react';
import ReactDOM from 'react-dom';
import gon from 'gon';
import Cookies from 'js-cookie';
import faker from 'faker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
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
// eslint-disable-next-line no-underscore-dangle
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(
  reducers,
  {
    channels: prepareData(channels),
    messages: prepareData(messages),
  },
  reduxDevTools,
);
const userName = getOrGenerateName();

ReactDOM.render(
  <Provider store={store}>
    <ChatApp userName={userName} />
  </Provider>,
  document.getElementById('chatApp'),
);
