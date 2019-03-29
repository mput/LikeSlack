import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import connect from '../connect';
import FormControlWrapper from './FormControlWrapper';
import channelNameNormolize from '../lib/normilizers';


@reduxForm({
  form: 'addChannel',
  initialValues: { channelName: '#' },
})
@connect()
class AddChannelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inAddingChannelState: false,
    };
  }

  toggleAddingChannelState = () => {
    const { inAddingChannelState } = this.state;
    const { reset } = this.props;
    if (inAddingChannelState) {
      reset();
    }
    this.setState({ inAddingChannelState: !inAddingChannelState });
  }

  onSubmit = async ({ channelName }) => {
    const { addChannelRequset } = this.props;
    await addChannelRequset(channelName.slice(1));
    this.toggleAddingChannelState();
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      submitFailed,
    } = this.props;
    const { inAddingChannelState } = this.state;

    const form = (
      <Form onSubmit={handleSubmit(this.onSubmit)} className="mt-0 mb-2 bg-light">
        <InputGroup size="sm">
          <Field
            name="channelName"
            as="input"
            autoFocus
            className="rounded-0"
            placeholder="Channel name:"
            isInvalid={submitFailed}
            component={FormControlWrapper}
            disabled={submitting}
            normalize={channelNameNormolize}
          />
          <InputGroup.Append>
            <Button type="submit" variant="success" disabled={pristine}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </Button>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            Something wrong happened, try again please!
          </Form.Control.Feedback>
        </InputGroup>
      </Form>
    );

    return (
      <div className="mb-4">
        {inAddingChannelState && form}
        <Button
          block
          variant={inAddingChannelState ? 'danger' : 'light'}
          className="w-75 mx-auto mt-3 p-0"
          onClick={this.toggleAddingChannelState}
        >
          {inAddingChannelState
            ? <FontAwesomeIcon icon={faTimesCircle} />
            : <FontAwesomeIcon icon={faPlusCircle} />}
        </Button>
      </div>
    );
  }
}

export default AddChannelForm;
