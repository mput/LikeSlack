import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import * as actions from '../actions/thunkActions';

import connect from '../connect';
import { userMeSelector } from '../selectors';

const mapState = state => ({
  userMe: userMeSelector(state),
});
const mapActions = {
  authenticate: actions.authenticate,
  logOut: actions.logOut,
};

@connect(mapState, mapActions)
class Auth extends Component {
  render() {
    const {
      authenticate,
      logOut,
      userMe,
    } = this.props;

    const logInBtn = (
      <Button variant="dark" onClick={() => authenticate()}>
        <FontAwesomeIcon icon={faGithub} size="lg" />
        <span className="ml-2 font-weight-bold">
          Login
        </span>
      </Button>
    );
    const logOutBtn = (
      <Button className="ml-2 font-weight-bold" size="sm" variant="dark" onClick={logOut}>
        Log Out
      </Button>
    );

    const getSignedInElm = () => (
      <>
        <FontAwesomeIcon icon={faUser} />
        <span className="ml-1 font-weight-bold">
          {userMe.userName}
        </span>
        {logOutBtn}
      </>
    );
    return userMe ? getSignedInElm() : logInBtn;
  }
}
export default Auth;
