import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

import { channelView } from '../../lib/valuesView';
import { removeChannelInModal } from '../../actions/thunkActions';

const RemoveChannel = (props) => {
  const {
    handleHideModal,
    requested,
    failed,
    removeChannelInModal: removeChannel,
    data: { channel },
  } = props;

  const errMsg = (
    <h4 className="text-warning mt-2">Error, try again please!</h4>
  );

  const handleRemoveChannel = () => removeChannel(channel.id);

  return (
    <>
      <Modal.Header closeButton={!requested}>
        <Modal.Title>
          Delete channel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {'Are you sure you wont to delete '}
        <strong>
          {channelView(channel.name)}
        </strong>
        ?
        {failed && errMsg}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleRemoveChannel} disabled={requested}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Button variant="secondary" onClick={handleHideModal} disabled={requested}>
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
};

const mapActions = {
  removeChannelInModal,
};

export default connect(null, mapActions)(RemoveChannel);
