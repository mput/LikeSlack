import Router from 'koa-router';
import { Channel, Message } from '../../models';
import { ValidationError } from '../../lib/errors';

import { basicAuth } from '../../middlewares/jwtAuthorizationMiddleware';
// import logger from '../../lib/logger';
// const log = logger('messages-router');

export default () => {
  const router = new Router();
  router
    .get('messages', '/messages', async (ctx) => {
      const { before, after, limit = 10 } = ctx.query;
      ctx.assert(!(before && after), 422, new ValidationError(['Only "from" or "before" filter'], '', ''));
      const messages = await Message
        .query()
        .orderBy('createdAt', 'desc')
        .eager('author')
        .limit(limit)
        .skipUndefined()
        .where('createdAt', '>', after)
        .where('createdAt', '<', before);
      ctx.body = messages;
    })
    .get('/channels/:channelId/messages', async (ctx) => {
      const { before, after, limit = 10 } = ctx.query;
      ctx.assert(!(before && after), 422, new ValidationError(['Only "from" or "before" filter'], '', ''));
      const { channelId } = ctx.params;
      const channel = await Channel.query().findById(channelId);
      ctx.assert(channel, 404);
      const messages = await channel
        .$relatedQuery('messages')
        .orderBy('createdAt', 'desc')
        .eager('author')
        .limit(limit)
        .skipUndefined()
        .where('createdAt', '>', after)
        .where('createdAt', '<', before);
      ctx.body = messages;
    })
    .post('/channels/:channelId/messages', basicAuth(), async (ctx) => {
      const { channelId } = ctx.params;
      const { body } = ctx.request;
      const { userId: authorId } = ctx.jwtPayload;
      const channel = await Channel.query().findById(channelId);
      const newMessage = await channel
        .$relatedQuery('messages')
        .returning('*')
        .insert({ ...body, authorId })
        .eager('author');
      console.log(newMessage);
      ctx.socketEmit('newMessage', newMessage);
      ctx.status = 201;
      ctx.body = newMessage;
    });

  return router;
};
