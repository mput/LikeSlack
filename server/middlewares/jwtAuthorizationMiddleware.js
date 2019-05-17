import jwt from 'jsonwebtoken';
import _ from 'lodash';
import logger from '../lib/logger';
import { AuthorizationError } from '../lib/errors';
import { extractAccessJwt } from '../lib/helpers';

const log = logger('AuthMiddleware');

// eslint-disable-next-line import/prefer-default-export
export const basicAuth = (config = {}) => (ctx, next) => {
  const { ignoreExpiration = false } = config;
  const tokenSecret = process.env.TOKEN_SECRET;
  const token = extractAccessJwt(ctx);
  try {
    const payload = jwt.verify(token, tokenSecret, { ignoreExpiration });
    ctx.jwtPayload = _.omit(payload, ['exp', 'iat']);
  } catch (err) {
    log('JWT not verified: %s', err);
    throw new AuthorizationError();
  }
  return next();
};
