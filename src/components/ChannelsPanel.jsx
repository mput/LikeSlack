import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const ChannelItem = ({ name }) => (
  <ListGroup.Item action as="button" className="border-0 py-2">
    {`#${name}`}
  </ListGroup.Item>
);

const ChannelsPanel = ({ channels }) => (
  <Card className="mr-4 pb-2 align-self-start" style={{ minWidth: '12em' }}>
    <Card.Header>
      <h5 className="text-muted">LikeSlack</h5>
      <h6 className="mb-0">@userName</h6>
    </Card.Header>
    <strong className="pl-4 mt-3 text-muted">Channels</strong>
    <ListGroup variant="flush">
      {channels.map(({ name, id }) => (
        <ChannelItem name={name} key={id} />
      ))}
    </ListGroup>
  </Card>
);

export default ChannelsPanel;
