/* eslint-disable */
import Router from 'koa-router';
import passport from 'koa-passport';
import uuid from 'uuid/v4';
import JSONAPISerializer from 'json-api-serializer';
import { ValidationError } from "yup";

import db from '../../db';
import { channelSchema, messageSchema } from '../../lib/schemas';

const Serializer = new JSONAPISerializer();
Serializer.register('channels');
Serializer.register('messages');

export default (deps) => {
  const router = new Router();
  const { io, logger } = deps;
  const log = logger('auth-router');
  const getGitHubLoginURL = id => `https://${process.env.HOST}/api/v1/login/github/?tokenId=${id}`
  const getGitHubCallbackURL = id => `https://${process.env.HOST}/api/v1/login/github/callback?tokenId=${id}`

  router
    .get('/login/url/github', (ctx) => {
      const tokenId = uuid();
      ctx.body = {
        loginURL: getGitHubLoginURL(tokenId),
        tokenId,
      };
    })
    .get('/login/github', (ctx, next) => {
      const { tokenId } = ctx.query;
      passport.authenticate('github', {
        callbackURL: getGitHubCallbackURL(tokenId),
        session: false
      })(ctx, next);
    })
    .get('/login/github/callback', passport.authenticate('github', { session: false }), (ctx) => {
      const { tokenId } = ctx.query;
      console.log(tokenId);
      ctx.status = 200;
      ctx.body = ctx.req.user; // here should be user instance, and here we should generate token pair and save to db;
      // also we should set timer to delete tokens from db.
    })
    .get('/token', (ctx) => {
      const { tokenId } = ctx.query;
      // should return token pair to user.
    })
    .get('/token/refresh', (ctx) => {
      // получему оба токено, проверяем есть ли у пользователя такой токен в БД. Удаляем, создаем новые токены, записываем в БД, отправляем юзеру.
    });

  return router;
};
