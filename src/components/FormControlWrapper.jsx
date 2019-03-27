import React from 'react';
import { FormControl } from 'react-bootstrap';

const FormControlWrapper = ({
  input,
  onChange,
  inputRef,
  ...rest
}) => (
  <FormControl
    value={input.value}
    onChange={input.onChange}
    ref={inputRef}
    {...rest}
  />
);

export default FormControlWrapper;
