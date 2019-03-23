import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, ListGroup } from 'react-bootstrap';
import Contexts from './contexts';

const mapStateToProps = state => ({
  channels: state.channels,
});

const ChannelItem = ({ name }) => (
  <ListGroup.Item action as="button" className="border-0 py-2">
    {`#${name}`}
  </ListGroup.Item>
);

class ChannelsPanel extends Component {
  static contextType = Contexts;

  render() {
    const { userName } = this.context;
    const { channels } = this.props;
    return (
      <Card className="mr-4 pb-2 align-self-start" style={{ minWidth: '12em' }}>
        <Card.Header>
          <h5 className="text-muted">LikeSlack</h5>
          <h6 className="mb-0">{`@${userName}`}</h6>
        </Card.Header>
        <strong className="pl-4 mt-3 text-muted">Channels</strong>
        <ListGroup variant="flush">
          {channels.allIds.map(id => channels.byId[id]).map(({ name, id }) => (
            <ChannelItem name={name} key={id} />
          ))}
        </ListGroup>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(ChannelsPanel);
