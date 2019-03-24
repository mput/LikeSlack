import React from 'react';
import { Card } from 'react-bootstrap';
import Message from './Message';
import MessageForm from './MessageForm';

// eslint-disable-next-line
const MessagesPanel = () =>{
  return (
    // eslint-disable-next-line
    <Card className="flex-fill h-100 overflow-auto">
      <Card.Header>
        <strong>#general</strong>
      </Card.Header>
      <Card.Body className="d-flex flex-column px-4 py-0 overflow-auto">
        <Message n={1} first />
      </Card.Body>
      <MessageForm />
    </Card>
  );
};

export default MessagesPanel;
