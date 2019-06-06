import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Alert, Button } from 'react-bootstrap';
import { userNameView } from '../lib/valuesView';

import { activeChannelMessages, activeChannelSelector } from '../selectors';
import { loadNextMessagesAction } from '../actions/thunkActions';


const Message = ({ message, author, ownMessage }) => (
  <Alert
    variant={ownMessage ? 'warning' : 'info'}
    className="mt-0 mb-4 px-3 shadow-sm"
  >
    <h3 className="h6 mb-1 alert-heading font-weight-bold">{userNameView(author)}</h3>
    <p className="font-weight-normal mb-0">{message}</p>
  </Alert>
);

const mapStateToProps = state => ({
  // messages: activeChannelMessages(state),
  activeChannel: activeChannelSelector(state),
});

const mapActions = {
  loadNextMessages: loadNextMessagesAction,
};

@connect(mapStateToProps, mapActions)
class MessagesLits extends Component {
  constructor(props) {
    super(props);
    this.scrolTo = React.createRef();
  }

  componentDidMount() {
    this.scrolTo.current.scrollIntoView();
  }

  componentDidUpdate() {
    this.scrolTo.current.scrollIntoView();
  }

  handleLoadNextMessages() {
    const { loadNextMessages, activeChannel } = this.props;
    loadNextMessages(activeChannel.id);
  }

  render() {
    // const { messages } = this.props;
    const messages = [];

    return (
      <div className="flex-column mt-auto px-4 overflow-auto">
        {messages.map(({ message, id }, index) => (
          <Message
            message={message}
            first={index === 0}
            key={id}
          />
        ))}
        <div ref={this.scrolTo} />
        <Button
          block
          variant="dark"
          className="w-75 mx-auto my-3 p-0"
          onClick={this.handleLoadNextMessages}
        >
          LoadMessages
        </Button>
      </div>
    );
  }
}

export default MessagesLits;
