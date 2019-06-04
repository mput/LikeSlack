import { connect } from 'react-redux';
import * as actionCreators from './actions/actions';

export default mapStateToProps => Component => (
  connect(mapStateToProps, actionCreators)(Component)
);
