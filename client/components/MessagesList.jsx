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

const Message = ({ message, author, ownMessage }) => (
  <Alert
    variant={ownMessage ? 'warning' : 'info'}
    className="mt-0 mb-4 px-3 shadow-sm"
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
    this.scrolTo = React.createRef();
    this.listNewest = React.createRef();
    this.listOldest = React.createRef();
  }

  componentDidMount() {
    // this.scrolTo.current.scrollIntoView();
  }

  componentDidUpdate() {
    // this.scrolTo.current.scrollIntoView();
  }

  handleLoadHistory = () => {
    const { loadMessagesHistory, activeChannel } = this.props;
    loadMessagesHistory(activeChannel.id);
  }

  render() {
    const { messages, oldestMessage, usersById, activeChannel } = this.props;
    if (!activeChannel) {
      return (
        <h1>Loading channel</h1>
      );
    }
    const waypointKey = `${activeChannel.id}${oldestMessage ? oldestMessage.id : 0}`
    return (
      <div
        className="d-flex px-4 overflow-auto"
        style={{
          flexDirection: 'column-reverse',
          height: '100%',
        }}
      >
        <div ref={this.listNewest} />
        {messages.map(({ message, id, author }, index) => (
          <Message
            message={message}
            first={index === 0}
            author={usersById[author]}
            key={id}
          />
        ))}
        <Button
          block
          variant="dark"
          className="w-75 mx-auto my-3 p-0"
          onClick={this.handleLoadHistory}
        >
          LoadMessages
        </Button>
        <Waypoint
          key={waypointKey}
          onEnter={(data) => {
            console.log('enter', data);
            this.handleLoadHistory();
          }}
          onLeave={(data) => console.log('leave', data)}
        >
          <div>
            Some content here
          </div>
        </Waypoint>
        <div ref={this.listOldest} />
      </div>
    );
  }
}

export default MessagesLits;
