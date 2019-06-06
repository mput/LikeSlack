import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentMedical } from '@fortawesome/free-solid-svg-icons';

import FormControlWrapper from './FormControlWrapper';


@reduxForm({ form: 'sendMessage' })
@connect()
class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.msgInput = React.createRef();
  }

  onSubmit = async ({ msgText }) => {
    const {
      userName,
      channelId,
      sendMessageRequest,
      reset,
    } = this.props;
    await sendMessageRequest(msgText, userName, channelId);
    reset();
    this.msgInput.current.focus();
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      submitFailed,
    } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.onSubmit)} className="p-3 mx-3 mb-3 rounded shadow flex-shrink-0 bg-white">
        <InputGroup>
          <Field
            name="msgText"
            as="input"
            autoFocus
            placeholder="message"
            isInvalid={submitFailed}
            component={FormControlWrapper}
            disabled={submitting}
            inputRef={this.msgInput}
          />
          <InputGroup.Append>
            <Button type="submit" variant="outline-secondary" disabled={pristine || submitting}>
              <FontAwesomeIcon icon={faCommentMedical} />
            </Button>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            Something wrong happened, try again please!
          </Form.Control.Feedback>
        </InputGroup>
      </Form>
    );
  }
}

export default MessageForm;
