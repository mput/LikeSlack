import React from 'react';
import { Alert } from 'react-bootstrap';
import { userNameView } from '../lib/valuesView';

const Message = ({ message, author, ownMessage }) => (
  <Alert
    variant={ownMessage ? 'warning' : 'info'}
    className="d-block mt-0 mb-4 px-3 shadow-sm position-static"
  >
    <h3 className="h6 mb-1 alert-heading font-weight-bold">{userNameView(author.userName)}</h3>
    <p className="font-weight-normal mb-0">{message}</p>
  </Alert>
);

export default Message;
