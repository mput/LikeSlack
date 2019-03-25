import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Form,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import connect from '../connect';
import Contexts from './contexts';


const getRowsAmount = input => input.split('\n').length;

const MsgTextArea = ({
  placeholder,
  input,
  disabled,
  isInvalid,
  inputRef,
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
    ref={inputRef}
    autoFocus
  />
);

const mapStateToProps = state => ({
  activeChannelId: state.activeChannelId,
});


@reduxForm({ form: 'sendMessage' })
@connect(mapStateToProps)
class MessageForm extends Component {
  // TODO: move context to upper component.
  static contextType = Contexts;

  constructor(props) {
    super(props);
    this.msgInput = React.createRef();
  }

  onSubmit = async ({ msgText }) => {
    const { userName } = this.context;
    const { activeChannelId, sendMessageRequest, reset } = this.props;
    await sendMessageRequest(msgText, userName, activeChannelId);
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
      <Form onSubmit={handleSubmit(this.onSubmit)} className="px-4 pb-4 pt-1 flex-shrink-0">
        <InputGroup>
          <Field
            name="msgText"
            placeholder="message"
            isInvalid={submitFailed}
            component={MsgTextArea}
            disabled={submitting}
            inputRef={this.msgInput}
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

export default MessageForm;
