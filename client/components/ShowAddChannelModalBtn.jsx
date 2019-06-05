import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { modalWindowActions } from '../actions/actionCreators';


const ShowAddChannelModalBtn = (props) => {
  const { showModal } = props;
  const handleShowAddChannelModal = () => {
    showModal({
      type: 'AddChannel',
    });
  };

  return (
    <div className="mb-4">
      <Button
        block
        variant="light"
        className="w-75 mx-auto mt-3 p-0"
        onClick={handleShowAddChannelModal}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </Button>
    </div>
  );
};

const mapActions = {
  showModal: modalWindowActions.show,
};

export default connect(null, mapActions)(ShowAddChannelModalBtn);
