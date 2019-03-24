import React from 'react';
import classNames from 'classnames';
import { Media } from 'react-bootstrap';


const Message = ({ message, author, first }) => (
  <Media className={classNames('text-muted', 'flex-shrink-0', 'text-break', { 'mt-auto': first })}>
    <Media.Body>
      <strong className="mb-1">{`@${author}`}</strong>
      <p>
        {message}
      </p>
    </Media.Body>
  </Media>
);

export default Message;
