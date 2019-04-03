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
})
@connect(state => ({
  isAddChannelFormShown: state.isAddChannelFormShown,
}))
class AddChannelForm extends Component {
  handleFormVisibility = () => {
    const { reset, isAddChannelFormShown, toggleAddChannelFormVisibility } = this.props;
    if (isAddChannelFormShown) {
      reset();
    }
    toggleAddChannelFormVisibility();
  }

  onSubmit = async ({ channelName }) => {
    const { addChannelRequset, reset } = this.props;
    await addChannelRequset(channelName, true);
    reset();
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      submitFailed,
    } = this.props;
    const { isAddChannelFormShown } = this.props;

    const form = (
      <Form onSubmit={handleSubmit(this.onSubmit)} className="mt-0 mb-2  mx-2 bg-dark">
        <InputGroup size="sm">
          <InputGroup.Prepend>
            <InputGroup.Text>#</InputGroup.Text>
          </InputGroup.Prepend>
          <Field
            name="channelName"
            as="input"
            autoFocus
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

    const toggleBtnIcon = isAddChannelFormShown ? faTimesCircle : faPlusCircle;
    const toggleBtnVariant = isAddChannelFormShown ? 'warning' : 'light';
    console.log(isAddChannelFormShown);
    return (
      <div className="mb-4">
        {isAddChannelFormShown && form}
        <Button
          block
          variant={toggleBtnVariant}
          className="w-75 mx-auto mt-3 p-0"
          onClick={this.handleFormVisibility}
        >
          <FontAwesomeIcon icon={toggleBtnIcon} />
        </Button>
      </div>
    );
  }
}

export default AddChannelForm;
