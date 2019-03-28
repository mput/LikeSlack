import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import connect from '../connect';
import { channelsSelector } from '../selectors';

const mapStateToProps = state => ({
  channels: channelsSelector(state),
  activeChannelId: state.activeChannelId,
});


@connect(mapStateToProps)
class ChannelsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inAddingChannelState: false,
    };
  }

  handleChannelChange = id => () => {
    const { setActiveCahnnel } = this.props;
    setActiveCahnnel(id);
  }

  toggleAddingChannelState = () => {
    this.setState(state => ({ inAddingChannelState: !state.inAddingChannelState }));
  }

  render() {
    const { channels, activeChannelId } = this.props;
    const { inAddingChannelState } = this.state;
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
      <div className="px-0 bg-dark" style={{ minWidth: '12em' }}>
        <div className="d-flex justify-content-center align-items-center border-bottom border-secondary" style={{ height: '60px' }}>
          <h2 className="m-0 h4 text-light font-weight-light">LikeSlack</h2>
        </div>
        <h2 className="pl-3 mt-4 h6 text-white-50 text-uppercase ">Channels:</h2>
        <div>
          {channelsButtons.length && channelsButtons}
        </div>
        <Button
          block
          variant="light"
          className="w-75 mx-auto mt-2 p-0 "
          disabled={inAddingChannelState}
          onClick={this.toggleAddingChannelState}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </Button>
      </div>
    );
  }
}

export default ChannelsPanel;
