/* eslint-disable */
import Router from 'koa-router';
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
  const log = logger('channels-router');

  router
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
    .patch('/channels/:id', async (ctx) => {
	  const { id } = ctx.params;
      const { body } = ctx.request;
      const requestData = Serializer.deserialize('channels', body);
      await channelSchema.validate(requestData, { abortEarly: false});
	  const updatedData = await db('channels')
		.where({ id })
		.update(requestData, ['*']);
	  ctx.assert(updatedData.length === 1, 422, new ValidationError(['id doesn\'t exist'], '', 'id'));
      const responseData = Serializer.serialize('channels', updatedData[0]);
      io.emit('renameChannel', responseData);
      ctx.status = 204;
    })
    .get('/channels/:channelId/messages', (ctx) => {
    })
    .post('/channels/:channelId/messages', async (ctx) => {
	  const { channelId } = ctx.params;
	  const { body } = ctx.request;
	  const requestData = Serializer.deserialize('messages', body);
	  console.log(channelId);
	  await messageSchema.validate(requestData);
	  const newMessage = await db('messages').returning('*').insert(requestData);
	  console.log(newMessage);
	  const responseData = Serializer
		.serialize('messages', { ...newMessage[0], channelId: String(newMessage[0].channelId) });
	  io.emit('newMessage', responseData);
	  ctx.status = 201;
	  ctx.body = responseData;
    });

  return router;
};
