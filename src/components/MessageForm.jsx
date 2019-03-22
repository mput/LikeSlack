import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';


const MessageForm = () => (
  <InputGroup className="px-4 pb-4 flex-shrink-0">
    <FormControl as="textarea" rows="1" />
    <InputGroup.Append>
      <Button variant="outline-secondary">
        send
      </Button>
    </InputGroup.Append>
  </InputGroup>
);

export default MessageForm;
