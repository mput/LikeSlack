import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import * as actions from '../actions/thunkActions';
import { modalWindowActions } from '../actions/actionCreators';

import { userMeSelector } from '../selectors';

const mapState = state => ({
  userMe: userMeSelector(state),
});
const mapActions = {
  showModal: modalWindowActions.show,
  logOut: actions.logOut,
};

const Auth = (props) => {
  const {
    showModal,
    logOut,
    userMe,
  } = props;

  const handleShowLoginModal = () => showModal({ type: 'Login' });

  const showLoginModalBtn = (
    <Button variant="dark" onClick={handleShowLoginModal}>
      <FontAwesomeIcon icon={faSignInAlt} size="lg" />
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
  return userMe ? getSignedInElm() : showLoginModalBtn;
};

export default connect(mapState, mapActions)(Auth);
