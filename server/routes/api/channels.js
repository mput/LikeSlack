/* eslint-disable */
import Router from 'koa-router';
import { Channel, Message } from '../../models';

import { basicAuth } from '../../middlewares/jwtAuthorizationMiddleware';
import logger from '../../lib/logger';

const log = logger('auth-router');

export default (deps) => {
  const router = new Router();

  const { io, logger } = deps;
  const log = logger('channels-router');

  router
    .get('/channels', async (ctx) => {
      const channels = await Channel.query();
      ctx.body = channels;
    })
    .post('/channels', async (ctx) => {
      const { body } = ctx.request;
      const channelReq = Serializer.deserialize('channels', body);
      await channelSchema.validate(channelReq, { abortEarly: false});
      const newChannel = await db('channels')
        .returning('*')
        .insert(channelReq);
      const channelRes = Serializer.serialize('channels', newChannel[0]);
      io.emit('newChannel', channelRes);
      ctx.status = 201;
      ctx.body = channelRes;

    })
    .delete('/channels/:id', async (ctx) => {
	  const { id } = ctx.params;
	  const deletedAmoutnt = await db('channels').delete().where({ id });
	  ctx.assert(deletedAmoutnt === 1, 422, new ValidationError(['id doesn\'t exist'], '', 'id'));
      const channelRes = Serializer.serialize('channels', { id });
      io.emit('removeChannel', channelRes);
      ctx.status = 204;

    })
    .patch('/channels/:id', async (ctx) => {
      const { id } = ctx.params;
      const { body } = ctx.request;
      const requestData = Serializer.deserialize('channels', body);
      await channelSchema.validate(requestData, { abortEarly: false });
      const updatedData = await db('channels')
        .where({ id })
        .update(requestData, ['*']);
      ctx.assert(updatedData.length === 1, 422, new ValidationError(['id doesn\'t exist'], '', 'id'));
      const responseData = Serializer.serialize('channels', updatedData[0]);
      io.emit('renameChannel', responseData);
      ctx.status = 204;
    })

  return router;
};
