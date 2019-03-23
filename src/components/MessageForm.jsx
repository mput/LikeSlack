import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Form,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

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

const MessageForm = ({ handleSubmit }) => {
  const getData = (data) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(getData)} className="px-4 pb-4 pt-1 flex-shrink-0">
      <InputGroup>
        <Field name="msgText" component={MsgTextArea} placeholder="message" />
        <InputGroup.Append>
          <Button type="submit" variant="outline-secondary">
            send
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default reduxForm({
  form: 'sendMsg',
})(MessageForm);
