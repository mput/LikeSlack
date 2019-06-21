import React from 'react';
import { Alert } from 'react-bootstrap';
import {
  format,
  distanceInWords,
  differenceInMinutes,
  differenceInHours,
} from 'date-fns';
import { userNameView } from '../lib/valuesView';

const formatTime = (time) => {
  const formatters = [
    {
      predicate: date => (differenceInMinutes(new Date(), new Date(date)) < 60),
      formatter: date => (distanceInWords(new Date(date), new Date(), { includeSeconds: true })),
    }, {
      predicate: date => (differenceInHours(new Date(), new Date(date)) < 24),
      formatter: date => (format(new Date(date), 'HH:mm')),
    }, {
      predicate: () => true,
      formatter: date => (format(new Date(date), 'MMMM Do YYYY')),
    },
  ];
  const { formatter } = formatters.find(({ predicate }) => predicate(time));
  return formatter(time);
};

const Message = ({ message, author, ownMessage }) => {
  const { message: text, createdAt } = message;
  const timeFormated = formatTime(createdAt);

  return (
    <Alert
      variant={ownMessage ? 'warning' : 'info'}
      className="d-block mt-0 mb-4 px-3 shadow-sm position-static"
    >
      <h3 className="d-inline h6 mb-1 alert-heading font-weight-bold">{userNameView(author.userName)}</h3>
      <span className="ml-2">{timeFormated}</span>
      <p className="font-weight-normal mb-0">{text}</p>
    </Alert>
  );
};

export default Message;
