import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Message from './Message';
import MessageForm from './MessageForm';
import Contexts from './contexts';
import connect from '../connect';
import { activeChannelMessages } from '../selectors';

const mapStateToProps = state => ({
  messages: activeChannelMessages(state),
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
    const { messages } = this.props;
    const { userName } = this.context;
    return (
      <Card className="flex-fill h-100 overflow-auto">
        <Card.Header>
          <strong>#general</strong>
        </Card.Header>
        <Card.Body className="d-flex flex-column px-4 py-0 overflow-auto">
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
        </Card.Body>
        <MessageForm />
      </Card>
    );
  }
}

export default MessagesPanel;
