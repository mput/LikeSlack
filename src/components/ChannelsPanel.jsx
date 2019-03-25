import React, { Component } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import Contexts from './contexts';
import connect from '../connect';
import { channelsSelector } from '../selectors';

const mapStateToProps = state => ({
  channels: channelsSelector(state),
  activeChannelId: state.activeChannelId,
});

const ChannelItem = ({ name, active }) => (
  <ListGroup.Item action as="button" className="border-0 py-1" active={active}>
    <strong>{`#${name}`}</strong>
  </ListGroup.Item>
);

@connect(mapStateToProps)
class ChannelsPanel extends Component {
  static contextType = Contexts;

  render() {
    const { userName } = this.context;
    const { channels, activeChannelId } = this.props;

    return (
      <Card className="mr-4 pb-2 align-self-start" style={{ minWidth: '12em' }}>
        <Card.Header>
          <h5 className="text-muted">LikeSlack</h5>
          <h6 className="mb-0">{`@${userName}`}</h6>
        </Card.Header>
        <strong className="pl-3 mt-3 mb-1 text-muted">Channels</strong>
        <ListGroup variant="flush">
          {channels.map(({ name, id }) => (
            <ChannelItem name={name} active={id === activeChannelId} key={id} />
          ))}
        </ListGroup>
      </Card>
    );
  }
}

export default ChannelsPanel;
