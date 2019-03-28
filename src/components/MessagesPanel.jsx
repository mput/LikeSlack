import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Message from './Message';
import MessageForm from './MessageForm';
import Contexts from './contexts';
import connect from '../connect';
import { activeChannelMessages, activeChannel } from '../selectors';

const mapStateToProps = state => ({
  messages: activeChannelMessages(state),
  channel: activeChannel(state),
});

@connect(mapStateToProps)
class MessagesPanel extends Component {
  static contextType = Contexts;

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

  render() {
    const { messages, channel } = this.props;
    const { userName } = this.context;
    return (
      <div className="bg-light flex-fill h-100 p-0 d-flex flex-column">
        <div className="border-bottom d-flex align-items-center" style={{ minHeight: '60px' }}>
          <h2 className="ml-3 my-0 h4">{`#${channel.name}`}</h2>
          <p className="ml-auto mr-4 my-0">
            <FontAwesomeIcon icon={faUser} />
            <span className="ml-1 font-weight-bold">
              {`${userName}`}
            </span>
          </p>
        </div>
        <div className="d-flex flex-column flex-fill px-4 overflow-auto">
          {messages.map(({ message, author, id }, index) => (
            <Message
              message={message}
              author={author}
              ownMessage={author === userName}
              first={index === 0}
              key={id}
            />
          ))}
          <div ref={this.scrolTo} />
        </div>
        <MessageForm userName={userName} channelId={channel.id} />
      </div>
    );
  }
}

export default MessagesPanel;
