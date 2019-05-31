import Router from 'koa-router';
import passport from 'koa-passport';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import { User, RefreshToken } from '../../models';

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

const cleanTokens = async (userId, lastTokenId) => {
  const maxIssuedTokensAmount = 3;
  const expiredTokensAmount = await RefreshToken
    .query()
    .delete()
    .where({ user_id: userId })
    .andWhere('expire_at', '<', new Date());
  log('Deleted %d expired tokens', expiredTokensAmount);
  // delete all tokens if amount exceed.
  const tokensAmountRes = await RefreshToken.query().count({ user_id: userId });
  const tokensAmount = Number(tokensAmountRes[0].user_id);
  log('User has %d tokens', tokensAmount);
  if (tokensAmount > maxIssuedTokensAmount) {
    const deletedTokens = await RefreshToken
      .delete()
      .where({ user_id: userId })
      .andWhere('id', '!=', lastTokenId);
    log('Deleted all (%d) tokens, except last one', deletedTokens);
  }
};

const updateOrCreateRefreshToken = async (userId, tokenId) => {
  log('I m in update');
  const tokenExpirationInDays = 60;
  const exp = dateToSecFromEpoch(Date.now()) + (86400 * tokenExpirationInDays);
  let id;
  if (tokenId) {
    id = tokenId;
    RefreshToken
      .query()
      .findById(id)
      .update({ expire_at: secFromEpochToDate(exp) });
    log('Refresh token updated, expire at: %s', secFromEpochToDate(exp));
  } else {
    const tokenEntry = RefreshToken
      .query()
      .returning('*')
      .insert({ user_id: userId, expire_at: secFromEpochToDate(exp) });
    ({ id } = tokenEntry);
    log('Refresh token created, expire at: %s', secFromEpochToDate(exp));
  }
  const token = jwt.sign({ id, exp }, tokenSecret);
  setTimeout(() => cleanTokens(userId, id).catch(err => log('Token cleaning error: %s', err)), 0);
  return token;
};

const validateRefreshToken = async (token) => {
  let payload;

  try {
    payload = jwt.verify(token, tokenSecret);
  } catch (err) {
    log('RefreshJWT was\'t verified: %s', err);
    throw new AuthorizationError();
  }
  const tokenRequest = await RefreshToken.query().findById(payload.id);
  if (!tokenRequest) {
    log('Token was recalled');
    throw new AuthorizationError();
  }
  const { expire_at: expireAt } = tokenRequest;
  const storedExp = dateToSecFromEpoch(expireAt);
  if (storedExp !== payload.exp) {
    log('date in token and in record not equal: token was stolen and used to update access token');
    await RefreshToken.query().where(payload.id);
    throw new AuthorizationError('Token experation time is wrong');
  }
  return payload;
};

export const createAccessToken = (payload, tokenExpirationInMinutes = 1) => {
  const exp = Math.floor(Date.now() / 1000) + tokenExpirationInMinutes;
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
      const deletedTokensAmount = await db('refresh_tokens')
        .delete()
        .where({ id });
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
    .get('/users/:id', basicAuth(), async (ctx) => {
      const id = ctx.params.id === 'me' ? ctx.jwtPayload.userId : ctx.params.id;
      log('Get user with ID: %d', id);
      const user = await User.query().findById(id);
      log('User: %O', user);
      ctx.assert(user, 422, new ValidationError(['User doesn\'t exist'], '', 'id'));
      ctx.status = 201;
      ctx.body = user;
    });
  return router;
};
