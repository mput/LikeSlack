import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import FormControlWrapper from '../FormControlWrapper';
import { authenticateInModal } from '../../actions/thunkActions';

const mapActions = {
  authenticate: authenticateInModal,
};

@connect(null, mapActions)
@reduxForm({ form: 'login' })
class Login extends Component {
  handleSocialLogin = provider => () => {
    const { authenticate } = this.props;
    authenticate(provider);
  };

  onLoginSubmit = async ({ userName }) => {
    const {
      authenticate,
    } = this.props;
    await authenticate('anonymous', { userName });
  }

  render() {
    const {
      handleSubmit,
      pristine,
      requested,
      failed,
    } = this.props;

    return (
      <div className="bg-light">
        <Modal.Header closeButton={!requested}>
          <Modal.Title className="w-100 text-center ml-4">
            <h3 className="my-0">Login</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <Button
            variant="dark"
            size="lg"
            className="mb-5"
            block
            onClick={this.handleSocialLogin('github')}
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
            <span className="font-weight-bold ml-2">
              Sign in with GitHub
            </span>
          </Button>
          <Form onSubmit={handleSubmit(this.onLoginSubmit)} className="mt-0 mb-5 mt-4">
            <h4 className="mb-3 text-center">Anonymous login</h4>
            <Field
              name="userName"
              size="lg"
              className="mb-3"
              as="input"
              placeholder="Username"
              isInvalid={failed}
              component={FormControlWrapper}
              disabled={requested}
            />
            <Button type="submit" size="lg" variant="outline-dark" block disabled={requested || pristine}>
              <span className="font-weight-bold">
                Sign In
              </span>
            </Button>
          </Form>
        </Modal.Body>
      </div>
    );
  }
}

export default Login;
