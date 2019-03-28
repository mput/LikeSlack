import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import connect from '../connect';
import { channelsSelector } from '../selectors';
import AddChannelForm from './AddChannelForm';

const mapStateToProps = state => ({
  channels: channelsSelector(state),
  activeChannelId: state.activeChannelId,
});


@connect(mapStateToProps)
class ChannelsPanel extends Component {
  handleChannelChange = id => () => {
    const { setActiveCahnnel } = this.props;
    setActiveCahnnel(id);
  }

  render() {
    const { channels, activeChannelId } = this.props;
    const channelsButtons = channels.map(({ name, id }) => (
      <Button
        block
        key={id}
        variant="dark"
        className="rounded-0 m-0 pl-3 text-left text-white"
        active={id === activeChannelId}
        onClick={this.handleChannelChange(id)}
      >
        <strong>{`#${name}`}</strong>
      </Button>
    ));

    return (
      <div className="d-flex flex-column px-0 bg-dark" style={{ width: '12em' }}>
        <div className="d-flex flex-shrink-0 justify-content-center align-items-center border-bottom border-secondary" style={{ height: '60px' }}>
          <h2 className="m-0 h4 text-light font-weight-light">LikeSlack</h2>
        </div>
        <h2 className="pl-3 mt-4 h6 text-white-50 text-uppercase ">Channels:</h2>
        <div className="overflow-auto">
          {channelsButtons.length && channelsButtons}
        </div>
        <AddChannelForm />
      </div>
    );
  }
}

export default ChannelsPanel;
