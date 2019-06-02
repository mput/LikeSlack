import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import connect from '../connect';
import { userMeSelector } from '../selectors';

@connect(state => ({
  userMe: userMeSelector(state),
}))
class Auth extends Component {
  render() {
    const {
      userMe,
      authenticate,
      logOutRequest,
    } = this.props;

    const logInBtn = (
      <Button variant="dark" onClick={authenticate}>
        <FontAwesomeIcon icon={faGithub} size="lg" />
        <span className="ml-2 font-weight-bold">
          Login
        </span>
      </Button>
    );
    const logOutBtn = (
      <Button className="ml-2 font-weight-bold" size="sm" variant="dark" onClick={logOutRequest}>
        Log Out
      </Button>
    );

    const getSignedInElm = () => (
      <>
        <FontAwesomeIcon icon={faUser} />
        <span className="ml-1 font-weight-bold">
          {userMe.user_name}
        </span>
        {logOutBtn}
      </>
    );
    return userMe ? getSignedInElm() : logInBtn;
  }
}
export default Auth;