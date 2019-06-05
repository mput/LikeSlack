import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { activeChannelSelector } from '../selectors';
import { modalWindowActions } from '../actions/actionCreators';
import { channelView } from '../lib/valuesView';


const ActiveChannelPanel = (props) => {
  const { channel, showModal } = props;
  if (!channel) return false;

  const handleShowRemoveChannelModal = () => {
    showModal({
      type: 'RemoveChannel',
      data: { channel },
    });
  };

  const handleShowRenameChannelModal = () => {
    showModal({
      type: 'RenameChannel',
      data: { channel },
    });
  };

  const getBtn = (onClick, icon) => (
    <Button
      variant="outline-dark"
      size="sm"
      className="border-0 px-1 py-0 mr-1"
      onClick={onClick}
      disabled={!channel.removable}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  );


  return (
    <div className="d-flex flex-column">
      <h2 className="my-0 h5 font-weight-bold">{ channelView(channel.name) }</h2>
      <div className="ml-n1">
        {getBtn(handleShowRemoveChannelModal, faTrash)}
        {getBtn(handleShowRenameChannelModal, faEdit)}
      </div>
    </div>
  );
};

const mapState = state => ({
  channel: activeChannelSelector(state),
});
const mapActions = {
  showModal: modalWindowActions.show,
};

export default connect(mapState, mapActions)(ActiveChannelPanel);
