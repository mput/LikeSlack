import React from 'react';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';
import Context from '../contexts';


const ChatApp = (props) => {
  const { userName } = props;
  return (
    <Context.Provider value={{ userName }}>
      <div className="d-flex vh-100">
        <ChannelsPanel />
        <MessagesPanel />
      </div>
    </Context.Provider>
  );
};

export default ChatApp;
