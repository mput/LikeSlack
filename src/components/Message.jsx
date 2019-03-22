import React from 'react';
import classNames from 'classnames';
import { Media } from 'react-bootstrap';


const Message = ({ n, first }) => (
  <Media className={classNames('text-muted', 'flex-shrink-0', { 'mt-auto': first })}>
    <Media.Body>
      <strong className="mb-1">@userName</strong>
      <p>
        Its place for message here.
        {n}
      </p>
    </Media.Body>
  </Media>
);

export default Message;
