import { AuthorizationError } from './errors';
import logger from './logger';

const log = logger('helpers');

export const extractAccessJwt = (ctx) => {
  const { authorization } = ctx.header;
  if (authorization && authorization.split(' ')[0] === 'JWT') {
    return authorization.split(' ')[1];
  }
  log('Can\'t extract JWT from header authorization: %s', authorization);
  throw new AuthorizationError();
};

export const extractRefreshJwt = (ctx) => {
  const { refresh } = ctx.header;
  if (refresh && refresh.split(' ')[0] === 'token') {
    return refresh.split(' ')[1];
  }
  log('Can\'t extract JWT from header refresh: %s', refresh);
  throw new AuthorizationError();
};

export const dateToSecFromEpoch = date => Math.floor(date / 1000);
export const secFromEpochToDate = sec => (new Date(sec * 1000)).toISOString();
