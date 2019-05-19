import Router from 'koa-router';
import JSONAPISerializer from 'json-api-serializer';

import db from '../../db';
import { ValidationError } from '../../lib/errors';
import logger from '../../lib/logger';
import { basicAuth } from '../../middlewares/jwtAuthorizationMiddleware';

const log = logger('auth-router');

const Serializer = new JSONAPISerializer();
Serializer.register('users');

export default () => {
  const router = new Router();
  router
    .get('/user/:id', basicAuth(), async (ctx) => {
      const id = ctx.params.id === 'me' ? ctx.jwtPayload.userId : ctx.params.id;
      log('Get user with ID: %d', id);
      const userProps = ['id', 'user_name', 'auth_provider', 'profile_url'];
      const [user] = await db('users').select(...userProps).where({ id });
      ctx.assert(user, 422, new ValidationError(['User doesn\'t exist'], '', 'id'));
      const userRes = Serializer.serialize('users', user);
      ctx.status = 201;
      ctx.body = userRes;
    });
  return router;
};
