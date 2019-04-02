import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

import connect from '../../connect';
import RemoveChannel from './RemoveChannel';

const typesToBodyComponents = {
  ChannelRename: RemoveChannel,
  ChannelRemove: null,
};

const mapStateToProps = state => ({
  modal: state.modal,
});

@connect(mapStateToProps)
class Modals extends Component {
  handleHideModal = () => {
    const { hideModal } = this.props;
    hideModal();
  };


  render() {
    const { modal } = this.props;
    const requested = modal.status === 'requested';
    const failed = modal.status === 'failed';
    const BodyComponent = typesToBodyComponents[modal.type];
    const modalBody = (
      <BodyComponent
        handleHideModal={this.handleHideModal}
        requested={requested}
        failed={failed}
        data={modal.data}
      />
    );

    return (
      <Modal
        show={modal.isShown}
        onHide={this.handleHideModal}
        backdrop={!requested}
      >
        {modal.isShown && modalBody}
      </Modal>

    );
  }
}

export default Modals;
