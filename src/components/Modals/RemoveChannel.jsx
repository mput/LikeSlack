import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import connect from '../../connect';
import { channelView } from '../../lib/valuesView';

@connect()
class RemoveChannel extends Component {
  handleDeleteChannel = () => {
    const { deleteChannelRequst, data: { channel } } = this.props;
    deleteChannelRequst(channel.id);
  }

  render() {
    const {
      handleHideModal,
      requested,
      failed,
      data: { channel },
    } = this.props;
    const errMsg = (
      <h4 className="text-warning mt-2">Error, try again please!</h4>
    );

    return (
      <>
        <Modal.Header closeButton={!requested}>
          <Modal.Title>
            Delete channel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {'Are you sure you wont to delete ' }
          <strong>
            {channelView(channel.name)}
          </strong>
          ?
          {failed && errMsg}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.handleDeleteChannel} disabled={requested}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button variant="secondary" onClick={handleHideModal} disabled={requested}>
            Cancel
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export default RemoveChannel;
