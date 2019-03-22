import React from 'react';
import { Container } from 'react-bootstrap';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';

const ChatContext = React.createContext();

const ChatApp = ({ channels, name }) => (
  <ChatContext.Provider value={{ name }}>
    <Container className="d-flex py-4 vh-100">
      <ChannelsPanel channels={channels} />
      <MessagesPanel />
    </Container>
  </ChatContext.Provider>
);

export default ChatApp;
