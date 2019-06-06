import Router from 'koa-router';
import { Channel, Message } from '../../models';
import { ValidationError } from '../../lib/errors';

import { basicAuth } from '../../middlewares/jwtAuthorizationMiddleware';
// import logger from '../../lib/logger';
// const log = logger('messages-router');

export default (deps) => {
  const router = new Router();

  const { io } = deps;

  router
    .get('messages', '/messages', async (ctx) => {
      const { before, from, limit = 10 } = ctx.query;
      ctx.assert(!(before && from), 422, new ValidationError(['Only "from" or "before" filter'], '', ''));
      const messages = await Message
        .query()
        .eager('author')
        .limit(limit)
        .skipUndefined()
        .where('createdAt', '>=', from)
        .where('createdAt', '<=', before);
      ctx.body = messages;
    })
    .get('/channels/:channelId/messages', async (ctx) => {
      const { before, from, limit = 10 } = ctx.query;
      ctx.assert(!(before && from), 422, new ValidationError(['Only "from" or "before" filter'], '', ''));
      const { channelId } = ctx.params;
      const channel = await Channel.query().findById(channelId);
      ctx.assert(channel, 404);
      const message = await channel
        .$relatedQuery('messages')
        .eager('author')
        .limit(limit)
        .skipUndefined()
        .where('createdAt', '>=', from)
        .where('createdAt', '<=', before);
      ctx.body = message;
    })
    .post('/channels/:channelId/messages', basicAuth(), async (ctx) => {
      const { channelId } = ctx.params;
      const { body } = ctx.request;
      const { userId: authorId } = ctx.jwtPayload;
      const channel = await Channel.query().findById(channelId);
      const newMessage = await channel
        .$relatedQuery('messages')
        .insert({ ...body, authorId })
        .eager('author');
      io.emit('newMessage', newMessage);
      ctx.status = 201;
      ctx.body = newMessage;
    });

  return router;
};
