import { connect } from 'react-redux';
// import * as actionCreators from './actions/channelActions';

export default (mapState, mapActions) => Component => (
  connect(mapState, mapActions)(Component)
);
