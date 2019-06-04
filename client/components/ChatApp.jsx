import React, { Component } from 'react';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';
import Modals from './Modals';
// import Context from '../contexts';
import connect from '../connect';
import Auth from './Auth';

@connect()
class ChatApp extends Component {
  componentDidMount() {
    const { initApp } = this.props;
    initApp();
  }

  render() {
    return (
      <>
        <div className="d-flex vh-100">
          <Auth />
          {0 && <ChannelsPanel />}
          {0 && <MessagesPanel />}
        </div>
        <Modals />
      </>
    );
  }
}

export default ChatApp;
