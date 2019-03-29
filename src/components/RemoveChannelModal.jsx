import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';

import connect from '../connect';
import { channelView } from '../lib/valuesView';

const mapStateToProps = state => ({
  removeChannelModal: state.removeChannelModal,
  channels: state.channels,
});
@connect(mapStateToProps)
class Modals extends Component {
  handleHideRemoveChannelModal = () => {
    const { hideRemoveChannelModal } = this.props;
    hideRemoveChannelModal();
  };

  handleDeleteChannel = channelId => () => {
    const { deleteChannelRequst } = this.props;
    deleteChannelRequst(channelId);
  }

  render() {
    const { removeChannelModal, channels } = this.props;
    const getModalBody = (channelId) => {
      const channelToDelete = channels.byId[channelId];
      return (
        <>
          <Modal.Header closeButton>
            <Modal.Title id="change-channel-modal">
              Delete channel
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {'Are you sure you wont to delete ' }
            <strong>
              {channelView(channelToDelete.name)}
            </strong>
            ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.handleDeleteChannel(channelId)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            <Button variant="secondary" onClick={this.handleHideRemoveChannelModal}>
              Close
            </Button>
          </Modal.Footer>
        </>
      );
    };

    const channelRemovingModal = (
      <Modal
        show={removeChannelModal.modalShown}
        onHide={this.handleHideRemoveChannelModal}
        aria-labelledby="change-channel-modal"
      >
        {removeChannelModal.modalShown && getModalBody(removeChannelModal.channelId)}
      </Modal>

    );
    return channelRemovingModal;
  }
}

export default Modals;
