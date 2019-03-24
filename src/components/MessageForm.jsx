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

const MsgTextArea = ({ placeholder, input }) => (
  <FormControl
    as="textarea"
    rows={getRowsAmount(input.value)}
    placeholder={placeholder}
    value={input.value}
    onChange={input.onChange}
    style={{ resize: 'none' }}
  />
);

class MessageForm extends Component {
  // TODO: move context to upper component.
  static contextType = Contexts;

  onSubmit = ({ msgText }) => {
    const { userName } = this.context;
    const { activeChannelId, sendMessageRequest } = this.props;
    sendMessageRequest(msgText, userName, activeChannelId);
  };

  render() {
    const { handleSubmit, msgText } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.onSubmit)} className="px-4 pb-4 pt-1 flex-shrink-0">
        <InputGroup>
          <Field name="msgText" component={MsgTextArea} placeholder="message" />
          <InputGroup.Append>
            <Button type="submit" variant="outline-secondary" disabled={!msgText}>
              send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    );
  }
}

const formName = 'sendMessage';
const selector = formValueSelector(formName);

const mapStateToProps = state => ({
  activeChannelId: state.activeChannelId,
  msgText: selector(state, 'msgText'),
});

const actionCreators = { sendMessageRequest: actions.sendMessageRequest };

const ConnectedMessageForm = connect(mapStateToProps, actionCreators)(MessageForm);

export default reduxForm({
  form: formName,
})(ConnectedMessageForm);
