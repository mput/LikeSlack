import React from 'react';
import { Container } from 'react-bootstrap';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';
import Context from './contexts';


const ChatApp = (props) => {
  const { userName } = props;
  return (
    <Context.Provider value={{ userName }}>
      <Container className="d-flex py-4 vh-100">
        <ChannelsPanel />
        <MessagesPanel />
      </Container>
    </Context.Provider>
  );
};

export default ChatApp;
