import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

import connect from '../connect';

const mapStateToProps = state => ({
  isAuthenticated: state.isAuthenticated,
});


@connect(mapStateToProps)
class testAuth extends Component {
  componentDidMount() {
    const { checkAuth } = this.props;
    checkAuth();
  }


  render() {
    const { isAuthenticated, authenticate, logOutRequest } = this.props;

    const testReq = async () => {
      console.log('Test Btn');
      const { data } = await axios.get('/api/v1/test');
      alert(data);
    };


    const logInBtn = (
      <Button onClick={authenticate}>
        GitHub Auth btn
      </Button>
    );

    const logOutBtn = (
      <Button onClick={logOutRequest}>
        Log Out.
      </Button>
    );

    const testBtn = (
      <Button onClick={testReq}>
        Test btn.
      </Button>
    );

    return (
      <div>
        <h1>Hello World!</h1>
        {isAuthenticated ? logOutBtn : logInBtn}
        <br />
        {testBtn}
      </div>
    );
  }
}

export default testAuth;
