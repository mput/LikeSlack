import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import Message from './Message';
import MessageForm from './MessageForm';
import { activeChannelMessages } from '../selectors';

const mapStateToProps = state => ({
  messages: activeChannelMessages(state),
});

// eslint-disable-next-line
const MessagesPanel = ({ messages }) =>{
  return (
    <Card className="flex-fill h-100 overflow-auto">
      <Card.Header>
        <strong>#general</strong>
      </Card.Header>
      <Card.Body className="d-flex flex-column px-4 py-0 overflow-auto">
        {messages.map(({ message, author, id }, index) => (
          <Message
            message={message}
            author={author}
            first={index === 0}
            key={id}
          />
        ))}
      </Card.Body>
      <MessageForm />
    </Card>
  );
};

export default connect(mapStateToProps)(MessagesPanel);
