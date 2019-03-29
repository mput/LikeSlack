import React from 'react';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';
import RemoveChannelModal from './RemoveChannelModal';
import Context from '../contexts';


const ChatApp = (props) => {
  const { userName } = props;
  return (
    <Context.Provider value={{ userName }}>
      <div className="d-flex vh-100">
        <ChannelsPanel />
        <MessagesPanel />
      </div>
      <RemoveChannelModal />
    </Context.Provider>
  );
};

export default ChatApp;
