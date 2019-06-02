import Router from 'koa-router';
import { Channel } from '../../models';

import { basicAuth } from '../../middlewares/jwtAuthorizationMiddleware';
import logger from '../../lib/logger';

const log = logger('auth-router');

export default (deps) => {
  const router = new Router();
  const { io } = deps;

  router
    .get('/channels/:id?', async (ctx) => {
      const { id } = ctx.params;
      if (id) {
        const channel = await Channel.query().findById(id);
        ctx.assert(channel, 404);
        ctx.body = channel;
        return;
      }
      const channels = await Channel.query();
      ctx.body = channels;
    })
    .post('/channels', basicAuth(), async (ctx) => {
      const { body } = ctx.request;
      log(body);
      const newChannel = await Channel
        .query()
        .returning('*')
        .insert(body);
      io.emit('newChannel', newChannel);
      ctx.status = 201;
      ctx.body = newChannel;
    })
    .delete('/channels/:id', async (ctx) => {
      const { id } = ctx.params;
      const deletedAmount = await Channel.query().findById(id).delete();
      ctx.assert(deletedAmount === 1, 404);
      io.emit('removeChannel', { id: Number(id) });
      ctx.status = 204;
    })
    .patch('/channels/:id', async (ctx) => {
      const { id } = ctx.params;
      const { body } = ctx.request;
      const patchedChannel = await Channel.query().patchAndFetchById(id, body);
      ctx.assert(patchedChannel, 404);
      io.emit('renameChannel', patchedChannel);
      ctx.status = 204;
    });

  return router;
};
