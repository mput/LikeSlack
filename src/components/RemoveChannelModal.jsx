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
    const { modalShown, status, channelId } = removeChannelModal;
    const requested = status === 'requested';
    const failed = status === 'failed';

    const getModalBody = () => {
      const channelToDelete = channels.byId[channelId];
      return (
        <>
          <Modal.Header closeButton={!requested}>
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
            {failed
              && <h4 className="text-warning mt-2">Error, try again please!</h4>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.handleDeleteChannel(channelId)} disabled={requested}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            <Button variant="secondary" onClick={this.handleHideRemoveChannelModal} disabled={requested}>
              Close
            </Button>
          </Modal.Footer>
        </>
      );
    };

    return (
      <Modal
        show={removeChannelModal.modalShown}
        onHide={this.handleHideRemoveChannelModal}
        aria-labelledby="change-channel-modal"
        backdrop={!requested}
      >
        {modalShown && getModalBody()}
      </Modal>

    );
  }
}

export default Modals;
