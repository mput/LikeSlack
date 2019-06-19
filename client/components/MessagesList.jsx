import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Waypoint } from 'react-waypoint';

import LoadingInfoPanel from './LoadingInfoPanel';
import Message from './Message';
import {
  activeChannelSelector,
  activeChannelMessagesSelector,
  oldestActiveChannelMessageSelector,
  usersByIdSelector,
  meIdSelector,
} from '../selectors';
import { loadMessagesHistoryAction } from '../actions/thunkActions';


const mapStateToProps = state => ({
  messages: activeChannelMessagesSelector(state),
  oldestMessage: oldestActiveChannelMessageSelector(state),
  activeChannel: activeChannelSelector(state),
  usersById: usersByIdSelector(state),
  meId: meIdSelector(state),
});
const mapActions = {
  loadMessagesHistory: loadMessagesHistoryAction,
};

@connect(mapStateToProps, mapActions)
class MessagesLits extends Component {
  constructor(props) {
    super(props);
    this.messagesLits = React.createRef();
    this.infinityScrollOffset = 40;
  }

  componentDidUpdate(prevProps, _prevState, snap) {
    if (!snap) {
      return;
    }
    const { scrollHeight, clientHeight } = this.messagesLits.current;
    const { prevScrollHeight, prevScrollTop, prevClientHeight } = snap;
    const { messages: prevMessages, activeChannel: prevActiveChannel } = prevProps;
    const { messages, activeChannel } = this.props;

    const wasScrollAtBottom = prevScrollTop + prevClientHeight >= prevScrollHeight;
    const wasChannelChanged = prevActiveChannel.id !== activeChannel.id;
    const wasNewMassageAdded = (
      prevMessages.length
      && messages.length
      && prevMessages[0].id === messages[0].id
    );

    if (wasScrollAtBottom || wasChannelChanged) {
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
      meId,
      activeChannel,
    } = this.props;

    const getListCore = () => {
      const waypointKey = `${activeChannel.id}${oldestMessage ? oldestMessage.id : 0}`;
      return (
        <>
          <div
            className="h-100 d-flex flex-column pt-3 overflow-auto px-4 position-absolute"
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            ref={this.messagesLits}
          >
            <div className="mt-auto" />
            {activeChannel.hasHistory && activeChannel.loadingHistoryState === 'notLoading' && (
              <Waypoint
                topOffset={`-${this.infinityScrollOffset}px`}
                key={waypointKey}
                onEnter={this.handleLoadHistory}
              />
            )}
            {messages.map(({ message, id, author }) => (
              <Message
                message={message}
                author={usersById[author]}
                ownMessage={author === meId}
                key={id}
              />
            ))}
          </div>
          <LoadingInfoPanel
            loadingState={activeChannel.loadingHistoryState}
            handleLoadHistory={this.handleLoadHistory}
          />
        </>
      );
    };
    const plug = <h1>Loading...</h1>;

    return (
      <div
        className="flex-fill d-flex flex-column position-relative"
      >
        {activeChannel ? getListCore() : plug}
      </div>
    );
  }
}

export default MessagesLits;
