import request from 'supertest';
import io from 'socket.io-client';
import path from 'path';
import { promises as fsPromises } from 'fs';
import uuid from 'uuid/v4';

import { knex } from '../db';
import getApp from '..';
import { createAccessToken } from '../routes/api/auth';

const accessToken = `JWT ${createAccessToken({ userId: 1 }, 30)}`;

const app = getApp();
const apiUrl = '/api/v1';

const getResponseFromJson = async (fileName) => {
  const json = await fsPromises.readFile(path.join(__dirname, '__fixtures__', '__responses__', fileName), 'utf-8');
  return JSON.parse(json);
};

let socket;
beforeAll(async (done) => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
  app.listen(0, () => {
    const httpServerAddr = app.address();
    socket = io(
      `http://localhost:${httpServerAddr.port}`,
      { forceNew: true, reconnect: false },
    );
    socket.on('connect', () => {
      done();
    });
  });
});

afterAll(async (done) => {
  socket.close();
  await knex.destroy();
  app.close(() => {
    done();
  });
});

beforeEach(async () => {
  await knex.seed.run();
});

describe('Get root page', () => {
  test('root page should answer', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('Channels CRUD', () => {
  const getChannelsUrl = () => `${apiUrl}/channels`;
  const getChannelUrl = id => `${apiUrl}/channels/${id}`;

  test('Get', async () => {
    const expectedResponse = await getResponseFromJson('get_channels.json');
    const { statusCode, body } = await request(app).get(getChannelsUrl());
    expect(statusCode).toBe(200);
    expect(body).toEqual(expectedResponse);
  });

  test('Create', async (done) => {
    const dataFromClient = { name: 'ChannelNameTestCreate' };
    const id = uuid();
    const expectedResponse = {
      id: expect.any(Number),
      name: dataFromClient.name,
      removable: true,
    };
    socket.on('newChannel', ({ payload, meta }) => {
      if (meta.senderId === id) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });
    const { statusCode, body } = await request(app)
      .post(getChannelsUrl())
      .set('Authorization', accessToken)
      .set('id', id)
      .send(dataFromClient);
    expect(statusCode).toBe(201);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Create w/ ValidationError', async () => {
    const dataFromClient = {
      name: '5'.repeat(50),
    };
    const expectedResponse = {
      errors: [
        {
          status: '422',
          title: 'ValidationError',
          detail: 'name: should NOT be longer than 40 characters',
        },
      ],
    };
    const { statusCode, body } = await request(app)
      .post(getChannelsUrl())
      .set('Authorization', accessToken)
      .send(dataFromClient);
    expect(statusCode).toBe(422);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Create w/ DuplicationError', async () => {
    const dataFromClient = {
      name: 'awesomeChannel',
    };
    const expectedResponse = {
      errors: [
        {
          status: '422',
          title: 'DuplicationError',
          detail: 'Key (name)=(awesomeChannel) already exists.',
        },
      ],
    };
    await request(app)
      .post(getChannelsUrl())
      .send(dataFromClient)
      .set('Authorization', accessToken)
      .expect(201);
    const { statusCode, body } = await request(app)
      .post(getChannelsUrl())
      .set('Authorization', accessToken)
      .send(dataFromClient);
    expect(statusCode).toBe(422);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Delete', async (done) => {
    const channelId = 1;
    const id = uuid();
    const expectedResponse = {
      id: channelId,
    };

    socket.on('removeChannel', async ({ payload, meta }) => {
      if (meta.senderId === id) {
        expect(payload).toMatchObject(expectedResponse);
        await request(app).get(getChannelUrl(channelId)).expect(404);
        done();
      }
    });
    await request(app).get(getChannelUrl(channelId)).expect(200);
    await request(app).delete(getChannelUrl(channelId))
      .set('Authorization', accessToken)
      .set('id', id)
      .expect(204);
  });

  test('Update', async (done) => {
    const channelId = 3;
    const id = uuid();
    const newName = 'NewChannelName17830';
    const renameChannelData = {
      name: newName,
    };
    const expectedResponse = {
      id: channelId,
      name: newName,
    };
    socket.on('renameChannel', ({ payload, meta }) => {
      if (meta.senderId === id) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });
    await request(app)
      .patch(getChannelUrl(channelId))
      .set('Authorization', accessToken)
      .set('id', id)
      .send(renameChannelData)
      .expect(200);
  });

  test('Update w/ not existing id', async () => {
    const renameChannelData = {
      name: 'NewChannelName17830',
    };

    const expectedResponse = {
      errors: { status: '404', title: 'NotFoundError' },
    };
    const { statusCode, body } = await request(app)
      .patch(getChannelUrl(5))
      .set('Authorization', accessToken)
      .send(renameChannelData);
    expect(statusCode).toBe(404);
    expect(body).toMatchObject(expectedResponse);
  });
});


describe('Messages CRUD', () => {
  const getMessagesUrl = channelId => `${apiUrl}/channels/${channelId}/messages`;
  const getAllMessagesUrl = () => `${apiUrl}/messages`;

  test('Get all', async () => {
    const expectedResponse = await getResponseFromJson('get_all_messages_limit4.json');
    const { statusCode, body } = await request(app).get(getAllMessagesUrl()).query({ limit: 4 });
    expect(statusCode).toBe(200);
    expect(body).toEqual(expectedResponse);
  });

  test('Get all with both from and before error', async () => {
    await request(app)
      .get(getAllMessagesUrl())
      .query({ after: '2019-05-29T18:24:59.900Z', before: '2019-05-29T18:16:59.900Z' })
      .expect(422);
  });

  test('Get channel messages', async () => {
    const expectedResponse = await getResponseFromJson('get_one_message.json');
    const { statusCode, body } = await request(app)
      .get(getMessagesUrl(1));
    expect(statusCode).toBe(200);
    expect(body).toEqual(expectedResponse);
  });

  test('Get channel messages before', async () => {
    const { body } = await request(app)
      .get(getMessagesUrl(1))
      .query({ before: '2019-05-29T18:22:59.900Z' })
      .expect(200);
    expect(body.length).toEqual(1);
    expect(body[0].id).toEqual(1);
  });

  test('Create', async (done) => {
    const dataFromClient = {
      message: 'oh my message',
    };
    const channelId = 3;
    const id = uuid();

    const expectedResponse = {
      message: 'oh my message',
      channelId,
      author: {
        id: 1,
      },
    };
    socket.on('newMessage', ({ payload, meta }) => {
      if (meta.senderId === id) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });

    const { statusCode, body } = await request(app)
      .post(getMessagesUrl(channelId))
      .set('Authorization', accessToken)
      .set('id', id)
      .send(dataFromClient);
    expect(statusCode).toBe(201);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Create UnAuthorized attempt', async () => {
    const dataFromClient = {
      message: 'oh my message',
    };
    const channelId = 3;
    await request(app)
      .post(getMessagesUrl(channelId))
      .send(dataFromClient)
      .expect(403);
  });
});

describe('Auth', () => {
  const authUrl = provider => `${apiUrl}/auth/${provider}`;
  const refreshUrl = () => `${apiUrl}/auth/refresh`;
  const userUrl = userId => `${apiUrl}/users/${userId}`;
  const userMeUrl = () => `${apiUrl}/me`;

  test('Anonymous auth and token refresh', async (done) => {
    const userName = 'SuperUser';
    const expectedResponse = { accessToken: expect.any(String), refreshToken: expect.any(String) };
    const { statusCode: authStatusCode, body: firstTokensPair } = await request(app)
      .post(authUrl('anonymous'))
      .send({ userName });
    expect(authStatusCode).toBe(200);
    expect(firstTokensPair).toMatchObject(expectedResponse);

    setTimeout(async () => {
      const { statusCode: refreshStatusCode, body: refreshedTokensPair } = await request(app)
        .get(refreshUrl())
        .set('Authorization', `JWT ${firstTokensPair.accessToken}`)
        .set('Refresh', `token ${firstTokensPair.refreshToken}`);

      expect(refreshStatusCode).toBe(200);
      expect(refreshedTokensPair).toMatchObject(refreshedTokensPair);
      expect(firstTokensPair).not.toEqual(refreshedTokensPair);
      done();
    }, 1000);
  });

  test('Auth request should redirect', async () => {
    await request(app).get(authUrl('github')).expect(302);
  });

  test('Get user', async () => {
    const expectedResponse = await getResponseFromJson('get_user.json');
    const { statusCode, body } = await request(app)
      .get(userUrl(1))
      .set('Authorization', accessToken);
    expect(statusCode).toBe(200);
    expect(body).toEqual(expectedResponse);
  });

  test('Get user Me', async () => {
    const expectedResponse = await getResponseFromJson('get_user.json');
    const { statusCode, body } = await request(app)
      .get(userMeUrl())
      .set('Authorization', accessToken);
    expect(statusCode).toBe(200);
    expect(body).toEqual(expectedResponse);
  });
});
