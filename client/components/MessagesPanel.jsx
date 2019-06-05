import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button } from 'react-bootstrap';
import { channelView, userNameView } from '../lib/valuesView';

import MessageForm from './MessageForm';
import Auth from './Auth';
import Contexts from '../contexts';
import connect from '../connect';
import { activeChannelMessages } from '../selectors';


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

  handleShowRemoveChannelModal = () => {
    const { showModal, channel } = this.props;
    showModal({
      type: 'RemoveChannel',
      data: { channel },
    });
  }

  handleShowRenameChannelModal = () => {
    const { showModal, channel } = this.props;
    showModal({
      type: 'RenameChannel',
      data: { channel },
    });
  }

  render() {
    const { messages, channel } = this.props;
    const { userName } = this.context;

    const removeChannelModalBtn = (
      <Button
        variant="outline-dark"
        size="sm"
        className="border-0 px-1 py-0 mr-1"
        onClick={this.handleShowRemoveChannelModal}
        disabled={!channel.removable}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    );

    const renameChannelModalBtn = (
      <Button
        variant="outline-dark"
        size="sm"
        className="border-0 px-1 py-0"
        onClick={this.handleShowRenameChannelModal}
        disabled={!channel.removable}
      >
        <FontAwesomeIcon icon={faEdit} />
      </Button>
    );

    return (
      <div className="bg-light flex-fill h-100 p-0 d-flex flex-column">
        <div className="border-bottom d-flex align-items-center" style={{ minHeight: '60px' }}>
          <div className="ml-3 d-flex flex-column">
            <h2 className="my-0 h5 font-weight-bold">{channelView(channel.name)}</h2>
            <div className="ml-n1">
              {removeChannelModalBtn}
              {renameChannelModalBtn}
            </div>
          </div>
          <p className="ml-auto mr-4 my-0">
            <Auth />
          </p>
        </div>
        <div className="flex-column mt-auto px-4 overflow-auto">
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
