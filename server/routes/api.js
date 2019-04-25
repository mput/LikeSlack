/* eslint-disable */

import Router from 'koa-router';
import JSONAPISerializer from 'json-api-serializer';
import { ValidationError } from "yup";

import db from '../../db';
import { channelSchema } from '../../lib/schemas';

const Serializer = new JSONAPISerializer();
Serializer.register('channels');

export default (router, deps) => {
  const apiRouter = new Router();

  const { io, logger } = deps;
  const log = logger('router');

  apiRouter
    .get('/channels', (ctx) => {
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
    .patch('/channels/:id', (ctx) => {
    })
    .get('/channels/:channelId/messages', (ctx) => {
    })
    .post('/channels/:channelId/messages', (ctx) => {
    });

  router.use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods());
};
