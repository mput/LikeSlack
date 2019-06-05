import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import FormControlWrapper from '../FormControlWrapper';
import channelNameNormalize from '../../lib/nameNormalizers';
import { addChannelInModal } from '../../actions/thunkActions';

const mapActions = {
  addChannelInModal,
};

@connect(null, mapActions)
@reduxForm({
  form: 'renameChannel',
})
class AddChannel extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    setImmediate(() => this.textInput.current.focus());
  }

  onSubmit = async ({ channelName }) => {
    const {
      addChannelInModal: addChannel,
    } = this.props;
    await addChannel(channelName);
  }

  render() {
    const {
      handleSubmit,
      pristine,
      handleHideModal,
      requested,
      failed,
    } = this.props;

    return (
      <Form onSubmit={handleSubmit(this.onSubmit)} className="mt-0 mb-2 bg-light">
        <Modal.Header closeButton={!requested}>
          <Modal.Title>
            Add Channel.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form.Label>Channel name:</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>#</InputGroup.Text>
            </InputGroup.Prepend>
            <Field
              name="channelName"
              as="input"
              placeholder="Channel name:"
              inputRef={this.textInput}
              isInvalid={failed}
              component={FormControlWrapper}
              disabled={requested}
              normalize={channelNameNormalize}
            />
            <Form.Control.Feedback type="invalid">
              Something wrong happened, try again please!
            </Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="danger" disabled={requested || pristine}>
            Add
          </Button>
          <Button variant="secondary" onClick={handleHideModal} disabled={requested}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    );
  }
}

export default AddChannel;
