import React, { Component } from 'react';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';
import Modals from './Modals';
import Context from '../contexts';
import connect from '../connect';

@connect()
class ChatApp extends Component {
  componentDidMount() {
    const { initState } = this.props;
    initState();
  }

  render() {
    const { userName } = this.props;
    return (
      <Context.Provider value={{ userName }}>
        <div className="d-flex vh-100">
          <ChannelsPanel />
          <MessagesPanel />
        </div>
        <Modals />
      </Context.Provider>
    );
  }
}

export default ChatApp;
