import React from 'react';
import classNames from 'classnames';
import { Media } from 'react-bootstrap';

const Message = ({
  message,
  author,
  ownMessage,
  first,
}) => (
  <Media
    className={classNames('flex-shrink-0', 'text-break', { 'mt-auto': first })}
  >
    <Media.Body>
      <strong className={classNames('mb-1', { 'text-warning': ownMessage })}>{`@${author}`}</strong>
      <p>
        {message}
      </p>
    </Media.Body>
  </Media>
);

export default Message;
