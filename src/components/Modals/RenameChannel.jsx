import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';

import FormControlWrapper from '../FormControlWrapper';
import connect from '../../connect';
import channelNameNormolize from '../../lib/normilizers';
import { channelView } from '../../lib/valuesView';

@connect((_state, ownProps) => {
  const channelName = ownProps.data.channel.name;
  return { initialValues: { channelName } };
})
@reduxForm({
  form: 'renameChannel',
})
class RenameChannel extends Component {
  onSubmit = async ({ channelName }) => {
    const {
      renameChannelRequest,
      data: { channel: { id } },
    } = this.props;
    await renameChannelRequest(id, channelName);
  }

  render() {
    const {
      handleSubmit,
      pristine,
      handleHideModal,
      requested,
      failed,
      data: { channel },
    } = this.props;

    return (
      <Form onSubmit={handleSubmit(this.onSubmit)} className="mt-0 mb-2 bg-light">
        <Modal.Header closeButton={!requested}>
          <Modal.Title>
            Rename channel
            <strong>
              {` ${channelView(channel.name)}`}
            </strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form.Label>New name:</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>#</InputGroup.Text>
            </InputGroup.Prepend>
            <Field
              name="channelName"
              as="input"
              autoFocus
              className="rounded-0"
              placeholder="Channel name:"
              isInvalid={failed}
              component={FormControlWrapper}
              disabled={requested}
              normalize={channelNameNormolize}
            />
            <Form.Control.Feedback type="invalid">
              Something wrong happened, try again please!
            </Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="danger" disabled={requested || pristine}>
            Rename
          </Button>
          <Button variant="secondary" onClick={handleHideModal} disabled={requested}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    );
  }
}

export default RenameChannel;
