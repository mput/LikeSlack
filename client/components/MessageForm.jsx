import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentMedical } from '@fortawesome/free-solid-svg-icons';
import { sendMessageAction } from '../actions/thunkActions';

import FormControlWrapper from './FormControlWrapper';
import { activeChannelIdSelector, userMeSelector } from '../selectors';

const mapState = state => ({
  activeChannelId: activeChannelIdSelector(state),
  userMe: userMeSelector(state),
});
const mapAction = {
  sendMessage: sendMessageAction,
};

@reduxForm({ form: 'sendMessage' })
@connect(mapState, mapAction)
class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.msgInput = React.createRef();
  }

  onSubmit = async ({ msgText }) => {
    const {
      activeChannelId,
      sendMessage,
      reset,
    } = this.props;
    await sendMessage(msgText, activeChannelId);
    reset();
    this.msgInput.current.focus();
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      submitFailed,
      userMe,
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
            disabled={submitting || !userMe}
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
