import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import FormControlWrapper from './FormControlWrapper';


@reduxForm({ form: 'addChannel' })
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

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      submitFailed,
    } = this.props;
    const { inAddingChannelState } = this.state;

    const form = (
      <Form onSubmit={handleSubmit} className="mt-0 mb-2 bg-light">
        <InputGroup size="sm">
          <Field
            name="channelName"
            as="input"
            autoFocus
            placeholder="Channel name:"
            isInvalid={submitFailed}
            component={FormControlWrapper}
            disabled={submitting}
            inputRef={this.msgInput}
          />
          <InputGroup.Append>
            <Button type="submit" variant="outline-success" disabled={pristine}>
              add
            </Button>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            Something wrong happened, try again please!
          </Form.Control.Feedback>
        </InputGroup>
      </Form>
    );

    return (
      <div>
        {inAddingChannelState && form}
        <Button
          block
          variant={inAddingChannelState ? 'danger' : 'light'}
          className="w-75 mx-auto mt-3 p-0 "
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
