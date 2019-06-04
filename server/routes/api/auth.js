import Router from 'koa-router';
import passport from 'koa-passport';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import { User, Session } from '../../models';

import { basicAuth } from '../../middlewares/jwtAuthorizationMiddleware';
import { AuthorizationError, ValidationError } from '../../lib/errors';
import { extractRefreshJwt, dateToSecFromEpoch, secFromEpochToDate } from '../../lib/helpers';
import logger from '../../lib/logger';

const log = logger('auth-router');
const tokenSecret = process.env.TOKEN_SECRET;


const findOrCreateUser = async (authProvider, profile) => {
  const user = await User
    .query()
    .findOne({ auth_provider: authProvider, validation_key: profile.id });
  if (user) {
    log('User exist');
    return user;
  }
  const userData = {
    userName: profile.username,
    fullName: profile.displayName,
    validationKey: profile.id,
    profileUrl: profile.profileUrl,
    authProvider,
  };
  const newUser = await User.query().returning('*').insert(userData);
  log('User created');
  return newUser;
};

const cleanSession = async (userId, lastTokenId) => {
  const maxIssuedTokensAmount = 3;
  const expiredTokensAmount = await Session
    .query()
    .delete()
    .where({ userId })
    .andWhere('expireAt', '<', new Date());
  log('Deleted %d expired sessions', expiredTokensAmount);
  // delete all tokens if amount exceeds max.
  const tokensAmount = await Session.query().where({ userId }).resultSize();
  log('User has %d sessions', tokensAmount);
  if (tokensAmount > maxIssuedTokensAmount) {
    const deletedTokens = await Session
      .query()
      .delete()
      .where({ userId })
      .andWhere('id', '!=', lastTokenId);
    log('Deleted all (%d) sessions, except last one', deletedTokens);
  }
};

const updateSessionExpTime = async (sessionId, exp) => {
  await Session
    .query()
    .findById(sessionId)
    .patch({ expireAt: secFromEpochToDate(exp) });
  log('Session updated, expire at: %s', secFromEpochToDate(exp));
};

const createSession = async (userId, exp) => {
  const { id } = await Session
    .query()
    .returning('*')
    .insert({ userId, expireAt: secFromEpochToDate(exp) });
  log('Session created, expire at: %s', secFromEpochToDate(exp));
  return id;
};

const updateOrCreateRefreshToken = async (userId, tokenId) => {
  const tokenExpirationInDays = 60;
  const exp = dateToSecFromEpoch(Date.now()) + (86400 * tokenExpirationInDays);
  let id;
  if (tokenId) {
    await updateSessionExpTime(tokenId, exp);
    id = tokenId;
  } else {
    id = await createSession(userId, exp);
  }
  const token = jwt.sign({ id, exp }, tokenSecret);
  setTimeout(() => cleanSession(userId, id).catch(err => log('Token cleaning error: %s', err)), 0);
  return token;
};

const validateRefreshToken = async (token) => {
  let payload;

  try {
    payload = jwt.verify(token, tokenSecret);
  } catch (err) {
    log('RefreshJWT wasn\'t verified: %s', err);
    throw new AuthorizationError();
  }
  const tokenRequest = await Session.query().findById(payload.id);
  if (!tokenRequest) {
    log('Token was recalled');
    throw new AuthorizationError('Refresh token isn\'t valid');
  }
  const { expireAt } = tokenRequest;
  const storedExp = dateToSecFromEpoch(expireAt);
  if (storedExp !== payload.exp) {
    log('Expiration time in token and in session record not equal: token was stolen and used to update access token');
    await Session.query().delete().findById(payload.id);
    throw new AuthorizationError('Refresh token isn\'t valid');
  }
  return payload;
};

export const createAccessToken = (payload, tokenExpirationInMinutes = 30) => {
  const exp = Math.floor(Date.now() / 1000) + (tokenExpirationInMinutes * 60);
  const tokenPayload = { ...payload, exp };
  return jwt.sign(tokenPayload, tokenSecret);
};

export default () => {
  const router = new Router();
  router
    .get('/auth/github', passport.authenticate('github', { session: false }))
    .get('/auth/github/callback', passport.authenticate('github', { session: false }), async (ctx) => {
      const profile = _.omit(ctx.req.user, ['_raw', '_json']);
      log('GH profile: %O', profile);
      const user = await findOrCreateUser('github', profile);
      log('User: %O', user);
      const refreshToken = await updateOrCreateRefreshToken(user.id);
      const accessToken = createAccessToken({ userId: user.id });
      ctx.render('successAuthRedirect', { refreshToken, accessToken });
    })
    .get('/auth/logout', async (ctx) => {
      const refreshToken = extractRefreshJwt(ctx);
      const { id } = jwt.verify(refreshToken, tokenSecret);
      const deletedTokensAmount = await Session
        .query()
        .delete()
        .findById(id);
      ctx.assert(deletedTokensAmount === 1, 422, new ValidationError(['Token doesn\'t exist'], '', ''));
      log('Session id: %d deleted, deleted %d session', id, deletedTokensAmount);
      ctx.status = 204;
    })
    .get('/auth/refresh', basicAuth({ ignoreExpiration: true }), async (ctx) => {
      const refreshToken = extractRefreshJwt(ctx);
      const accessTokenPayload = ctx.jwtPayload;
      const refreshTokenPayload = await validateRefreshToken(refreshToken);
      const { userId } = accessTokenPayload;
      const { id: tokenId } = refreshTokenPayload;
      log('Refresh token validated');
      const newRefreshToken = await updateOrCreateRefreshToken(userId, tokenId);
      const newAccessToken = createAccessToken(accessTokenPayload);
      ctx.body = { accessToken: newAccessToken, refreshToken: newRefreshToken };
    })
    .get('/me', basicAuth(), async (ctx) => {
      const id = ctx.jwtPayload.userId;
      log('Get own user with ID: %d', id);
      const user = await User.query().findById(id);
      log('User: %O', user);
      ctx.assert(user, 403, new AuthorizationError('Access token isn\'t valid'));
      ctx.status = 200;
      ctx.body = user;
    })
    .get('/users/:id', basicAuth(), async (ctx) => {
      const { id } = ctx.params;
      log('Get user with ID: %d', id);
      const user = await User.query().findById(id);
      log('User: %O', user);
      ctx.assert(user, 404);
      ctx.status = 200;
      ctx.body = user;
    });
  return router;
};
