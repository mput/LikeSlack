import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import uuid from 'uuid/v4';

import reducers from './reducers';
import ChatApp from './components/ChatApp';
import initAxiosIntercepter from './lib/axiosIntercepter';
import initSocketListener from './lib/initSocketListener';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/application.css';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk)),
);

const id = uuid();
initAxiosIntercepter(store, id);
initSocketListener(store, id);

ReactDOM.render(
  <Provider store={store}>
    <ChatApp />
  </Provider>,
  document.getElementById('chatApp'),
);
