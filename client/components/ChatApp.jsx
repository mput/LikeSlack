import React, { Component } from 'react';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';
import Modals from './Modals';
import connect from '../connect';
import Auth from './Auth';
import * as actions from '../actions/thunkActions';

const mapActions = { initApp: actions.initApp };
@connect(null, mapActions)
class ChatApp extends Component {
  componentDidMount() {
    const { initApp } = this.props;
    initApp();
  }

  render() {
    return (
      <>
        <div className="d-flex vh-100">
          {1 && <ChannelsPanel />}
          <div className="bg-light flex-fill h-100 p-0 d-flex flex-column">
            <div className="border-bottom d-flex align-items-center" style={{ minHeight: '60px' }}>
              <div className="ml-3 d-flex flex-column">
                <h2 className="my-0 h5 font-weight-bold">{/* channelView(channel.name) */}</h2>
                <div className="ml-n1">
                  { 
/*                   {removeChannelModalBtn}
                  {renameChannelModalBtn} */
                  }
                </div>
              </div>
              <p className="ml-auto mr-4 my-0">
                <Auth />
              </p>
            </div>

          </div>
        </div>
        <Modals />
      </>
    );
  }
}

export default ChatApp;
