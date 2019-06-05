import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import connect from '../connect';
import { channelsListSelector } from '../selectors';
import { uiActions } from '../actions/actionCreators';

const mapState = state => ({
  channels: channelsListSelector(state),
});
const mapActions = {
  setActiveChannel: uiActions.setActiveChannel,
};


@connect(mapState, mapActions)
class ChannelsPanel extends Component {
  handleChannelChange = id => () => {
    const { setActiveChannel } = this.props;
    setActiveChannel(id);
  }

  render() {
    const { channels } = this.props;
    const channelsButtons = channels.map(({ name, id, active }) => (
      <Button
        block
        key={id}
        variant="dark"
        className="rounded-0 m-0 pl-3 text-left text-white"
        active={active}
        onClick={this.handleChannelChange(id)}
      >
        <strong>{`#${name}`}</strong>
      </Button>
    ));

    return (
      <div className="overflow-auto">
        {channelsButtons}
      </div>
    );
  }
}

export default ChannelsPanel;
