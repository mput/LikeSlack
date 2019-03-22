import React from 'react';
import ReactDOM from 'react-dom';
import gon from 'gon';

import ChatApp from './ChatApp';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/application.css';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const { channels } = gon;
ReactDOM.render(<ChatApp channels={channels} />, document.getElementById('chatApp'));
