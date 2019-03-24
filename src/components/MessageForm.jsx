import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import {
  Form,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import * as actions from '../actions';
import Contexts from './contexts';


const getRowsAmount = input => input.split('\n').length;

const MsgTextArea = ({
  placeholder,
  input,
  disabled,
  isInvalid,
}) => (
  <FormControl
    as="input"
    rows={getRowsAmount(input.value)}
    isInvalid={isInvalid}
    placeholder={placeholder}
    value={input.value}
    onChange={input.onChange}
    disabled={disabled}
    style={{ resize: 'none' }}
    autoFocus
  />
);

class MessageForm extends Component {
  // TODO: move context to upper component.
  static contextType = Contexts;

  onSubmit = async ({ msgText }) => {
    const { userName } = this.context;
    const { activeChannelId, sendMessageRequest, reset } = this.props;
    await sendMessageRequest(msgText, userName, activeChannelId);
    reset();
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      submitFailed,
    } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.onSubmit)} className="px-4 pb-4 pt-1 flex-shrink-0">
        <InputGroup>
          <Field
            name="msgText"
            placeholder="message"
            isInvalid={submitFailed}
            component={MsgTextArea}
            disabled={submitting}
          />
          <InputGroup.Append>
            <Button type="submit" variant="outline-secondary" disabled={pristine}>
              send
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

const formName = 'sendMessage';
const mapStateToProps = state => ({
  activeChannelId: state.activeChannelId,
});

const actionCreators = { sendMessageRequest: actions.sendMessageRequest };

const ConnectedMessageForm = connect(mapStateToProps, actionCreators)(MessageForm);

export default reduxForm({
  form: formName,
})(ConnectedMessageForm);
