import React from 'react';
import { Container } from 'react-bootstrap';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';

const ChatApp = ({ channels }) => (
  <Container className="d-flex py-4 vh-100">
    <ChannelsPanel channels={channels} />
    <MessagesPanel />
  </Container>
);

export default ChatApp;
