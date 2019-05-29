import http from 'http';
import { ValidationError } from 'objection';

export { ValidationError };

export class AuthenticationError extends Error {
  constructor(message = http.STATUS_CODES[401]) {
    super(message);
    this.message = message;
    this.statusCode = 401;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthorizationError extends Error {
  constructor(message = http.STATUS_CODES[403]) {
    super(message);
    this.message = message;
    this.statusCode = 403;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  constructor(message = http.STATUS_CODES[404]) {
    super(message);
    this.message = message;
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ServerError extends Error {
  constructor(message = http.STATUS_CODES[500]) {
    super(message);
    this.message = message;
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
