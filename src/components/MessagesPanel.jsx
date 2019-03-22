import React from 'react';
import { Card } from 'react-bootstrap';
import Message from './Message';
import MessageForm from './MessageForm';

const MessagesPanel = () => (
  // eslint-disable-next-line
  <Card className="flex-fill h-100 overflow-auto">
    <Card.Header>
      <strong>#general</strong>
    </Card.Header>
    <Card.Body className="d-flex flex-column px-4 py-0 overflow-auto">
      <Message n={1} first />
      <Message n={2} />
      <Message n={3} />
      <Message n={3} />
      <Message n={3} />
      <Message n={3} />
      <Message n={3} />
      <Message n={100} />
    </Card.Body>
    <MessageForm />
  </Card>
);

export default MessagesPanel;
