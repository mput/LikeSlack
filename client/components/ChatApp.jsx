import React, { Component } from 'react';

import ChannelsList from './ChannelsList';
import ShowAddChannelModalBtn from './ShowAddChannelModalBtn';
// import MessagesPanel from './MessagesPanel';
import ActiveChannelPanel from './ActiveChannelPanel';
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
          <div className="d-flex flex-column px-0 bg-dark" style={{ width: '12em' }}>
            <div className="d-flex flex-shrink-0 justify-content-center align-items-center border-bottom border-secondary" style={{ height: '60px' }}>
              <h2 className="m-0 h4 text-light font-weight-light">LikeSlack</h2>
            </div>
            <h2 className="pl-3 mt-4 h6 text-white-50 text-uppercase ">Channels:</h2>
            <ChannelsList />
            <ShowAddChannelModalBtn />
          </div>
          <div className="bg-light flex-fill h-100 p-0 d-flex flex-column">
            <div className="border-bottom d-flex align-items-center" style={{ minHeight: '60px' }}>
              <div className="ml-3">
                <ActiveChannelPanel />
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
