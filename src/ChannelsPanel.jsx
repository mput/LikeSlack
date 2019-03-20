import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const ChannelItem = ({ name }) => (
  <ListGroup.Item action as="button">
    {`#${name}`}
  </ListGroup.Item>
);

const ChannelsPanel = ({ channels }) => (
  <Card className="mr-4 align-self-start" style={{ minWidth: '15em' }}>
    <Card.Header>
      <h5 className="text-muted">LikeSlack</h5>
      <h6 className="mb-0">@userName</h6>
    </Card.Header>
    <Card.Body className="pb-3">
      <Card.Title className="mb-0 h-6">
        Channels
      </Card.Title>
    </Card.Body>
    <ListGroup variant="flush">
      {channels.map(({ name, id }) => (
        <ChannelItem name={name} key={id} />
      ))}
    </ListGroup>
  </Card>
);

export default ChannelsPanel;
