import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Waypoint } from 'react-waypoint';
import { Alert, Button } from 'react-bootstrap';

import { userNameView } from '../lib/valuesView';
import {
  activeChannelSelector,
  activeChannelMessagesSelector,
  oldestActiveChannelMessageSelector,
  usersByIdSelector,
} from '../selectors';
import { loadMessagesHistoryAction } from '../actions/thunkActions';
// import logger from '../../server/lib/logger';

// const log = logger('messagesListComponent');

const Message = ({ message, author, ownMessage }) => (
  <Alert
    variant={ownMessage ? 'warning' : 'info'}
    className="d-block mt-0 mb-4 px-3 shadow-sm"
  >
    <h3 className="h6 mb-1 alert-heading font-weight-bold">{userNameView(author.userName)}</h3>
    <p className="font-weight-normal mb-0">{message}</p>
  </Alert>
);

const mapStateToProps = state => ({
  messages: activeChannelMessagesSelector(state),
  oldestMessage: oldestActiveChannelMessageSelector(state),
  activeChannel: activeChannelSelector(state),
  usersById: usersByIdSelector(state),
});

const mapActions = {
  loadMessagesHistory: loadMessagesHistoryAction,
};

@connect(mapStateToProps, mapActions)
class MessagesLits extends Component {
  constructor(props) {
    super(props);
    this.messagesLits = React.createRef();
    this.listNewest = React.createRef();
    this.listOldest = React.createRef();
    this.infinityScrollOffset = 40;
  }

  componentDidUpdate(prevProps, prevState, snap) {
    if (!snap) {
      return;
    }
    const { scrollHeight, clientHeight } = this.messagesLits.current;
    const { prevScrollHeight, prevScrollTop, prevClientHeight } = snap;
    const { messages: prevMessages } = prevProps;
    const { messages } = this.props;

    const wasScrollAtBottom = prevScrollTop + prevClientHeight >= prevScrollHeight;
    const wasNewMassageAdded = prevMessages.length && prevMessages[0].id === messages[0].id;

    if (wasScrollAtBottom) {
      this.messagesLits.current.scrollTop = scrollHeight - clientHeight;
      return;
    }
    if (wasNewMassageAdded) {
      return;
    }
    this.messagesLits.current.scrollTop = scrollHeight - prevScrollHeight;
  }

  getSnapshotBeforeUpdate() {
    if (this.messagesLits.current) {
      return {
        prevScrollHeight: this.messagesLits.current.scrollHeight,
        prevScrollTop: this.messagesLits.current.scrollTop,
        prevClientHeight: this.messagesLits.current.clientHeight,
      };
    }
    return null;
  }

  handleLoadHistory = () => {
    const { loadMessagesHistory, activeChannel } = this.props;
    loadMessagesHistory(activeChannel.id);
  }

  render() {
    const {
      messages,
      oldestMessage,
      usersById,
      activeChannel,
    } = this.props;

    if (!activeChannel) {
      return (
        <h1>Loading...</h1>
      );
    }

    const loadingMarker = (loadingState) => {
      if (loadingState === 'loading') {
        return (
          <div className="position-absolute d-block justify-content-center align-items-center py-3 bg-light">
            <span className="spinner-border spinner-border-sm mr-2" />
            <span>Loading...</span>
          </div>
        );
      }
      if (loadingState === 'failure') {
        return (
          <Button
            block
            variant="dark"
            className="w-75 mx-auto my-3 p-0"
            onClick={this.handleLoadHistory}
          >
            LoadMessages
          </Button>
        );
      }
      return false;
    };

    const loadHistoryWaypoint = () => {
      const waypointKey = `${activeChannel.id}${oldestMessage ? oldestMessage.id : 0}`;
      return (
        <Waypoint
          topOffset={`-${this.infinityScrollOffset}px`}
          key={waypointKey}
          onEnter={() => this.handleLoadHistory()}
        />
      );
    };

    return (
      <div
        className="flex-fill d-flex flex-column pt-3 overflow-auto px-4"
        ref={this.messagesLits}
      >
        <div className="mt-auto" />
        {loadingMarker(activeChannel.loadingHistoryState)}
        {activeChannel.hasHistory && loadHistoryWaypoint()}
        {messages.map(({ message, id, author }, index) => (
          <Message
            message={message}
            first={index === 0}
            author={usersById[author]}
            key={id}
          />
        ))}
        <div ref={this.listNewest} />
      </div>
    );
  }
}

export default MessagesLits;
