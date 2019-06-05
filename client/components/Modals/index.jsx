import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { modalWindowActions } from '../../actions/actionCreators';
import RemoveChannel from './RemoveChannel';
import RenameChannel from './RenameChannel';

const typesToBodyComponents = {
  RemoveChannel,
  RenameChannel,
};

const mapState = state => ({
  modal: state.ui.modal,
});
const mapActions = {
  hideModal: modalWindowActions.hide,
};


const Modals = (props) => {
  const { modal, hideModal } = props;
  const requested = modal.status === 'requested';
  const failed = modal.status === 'failed';
  const BodyComponent = typesToBodyComponents[modal.type];
  const getModalBody = () => (
    <BodyComponent
      handleHideModal={hideModal}
      requested={requested}
      failed={failed}
      data={modal.data}
    />
  );

  return (
    <Modal
      show={modal.isShown}
      onHide={hideModal}
      backdrop={!requested}
    >
      {modal.isShown && getModalBody()}
    </Modal>

  );
};

export default connect(mapState, mapActions)(Modals);
