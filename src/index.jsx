import React from 'react';
import ReactDOM from 'react-dom';
import ChatApp from './ChatApp';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/application.css';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

ReactDOM.render(<ChatApp />, document.getElementById('chatApp'));
