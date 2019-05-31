import request from 'supertest';
import io from 'socket.io-client';
import path from 'path';
import { promises as fsPromises } from 'fs';

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
    const dataFromClient = {
      data: {
        type: 'channel',
        attributes: {
          name: 'ChannelName1',
        },
      },
    };
    const expectedResponse = {
      data: {
        type: 'channels',
        id: expect.any(String),
        attributes: {
          name: 'ChannelName1',
          removable: true,
        },
      },
    };
    socket.on('newChannel', (payload) => {
      if (payload.data.attributes.name === dataFromClient.data.attributes.name) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });
    const { statusCode, body } = await request(app).post(getChannelsUrl()).send(dataFromClient);
    expect(statusCode).toBe(201);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Create w/ ValidationError', async () => {
    const dataFromClient = {
      data: {
        type: 'channel',
        attributes: {
          name: 'c',
        },
      },
    };
    const expectedResponse = {
      errors: [
        {
          status: '422',
          source: {
            pointer: 'name',
          },
          title: 'ValidationError',
          detail: 'name must be at least 2 characters',
        },
      ],
    };
    const { statusCode, body } = await request(app).post(getChannelsUrl()).send(dataFromClient);
    expect(statusCode).toBe(422);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Create w/ DuplicationError', async () => {
    const dataFromClient = {
      data: {
        type: 'channel',
        attributes: {
          name: 'awesomeChannel',
        },
      },
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
    await request(app).post(getChannelsUrl()).send(dataFromClient).expect(201);
    const { statusCode, body } = await request(app).post(getChannelsUrl()).send(dataFromClient);
    expect(statusCode).toBe(422);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Delete', async (done) => {
    const newChannelData = {
      data: {
        type: 'channel',
        attributes: {
          name: 'ChannelName',
        },
      },
    };
    const {
      body: {
        data: { id: channelId },
      },
    } = await request(app).post(getChannelsUrl()).send(newChannelData);
    const expectedResponse = {
      data: {
        type: 'channels',
        id: channelId,
      },
    };
    socket.on('removeChannel', (payload) => {
      if (payload.id === expectedResponse.id) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });
    await request(app).delete(getChannelUrl(channelId)).expect(204);
  });

  test('Delete w/ not existing id', async () => {
    const expectedResponse = {
      errors: [
        {
          status: '422',
          source: {
            pointer: 'id',
          },
          title: 'ValidationError',
          detail: 'id doesn\'t exist',
        },
      ],
    };
    const { statusCode, body } = await request(app).delete(getChannelUrl(1381));
    expect(statusCode).toBe(422);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Update', async (done) => {
    const newChannelData = {
      data: {
        type: 'channel',
        attributes: {
          name: 'ChannelName',
        },
      },
    };
    const renameChannelData = {
      data: {
        attributes: {
          name: 'NewChannelName17830',
        },
      },
    };
    const {
      body: {
        data: { id: channelId },
      },
    } = await request(app).post(getChannelsUrl()).send(newChannelData);
    const expectedResponse = {
      data: {
        type: 'channels',
        id: channelId,
        attributes: {
          name: 'NewChannelName17830',
        },
      },
    };
    socket.on('renameChannel', (payload) => {
      if (payload.data.attributes.name === expectedResponse.data.attributes.name) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });
    await request(app).patch(getChannelUrl(channelId)).send(renameChannelData).expect(204);
  });

  test('Update w/ not existing id', async () => {
    const renameChannelData = {
      data: {
        attributes: {
          name: 'NewChannelName17830',
        },
      },
    };

    const expectedResponse = {
      errors: [
        {
          status: '422',
          source: {
            pointer: 'id',
          },
          title: 'ValidationError',
          detail: 'id doesn\'t exist',
        },
      ],
    };
    const { statusCode, body } = await request(app)
      .patch(getChannelUrl(1912)).send(renameChannelData);
    expect(statusCode).toBe(422);
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

  test('Get all with both from and before', async () => {
    await request(app)
      .get(getAllMessagesUrl())
      .query({ from: '2019-05-29T18:24:59.900Z', before: '2019-05-29T18:16:59.900Z'})
      .expect(422);
  });

  test('Get all from', async () => {
    const { statusCode, body } = await request(app)
      .get(getAllMessagesUrl())
      .query({ from: '2019-05-29T18:22:59.900Z' });
    expect(statusCode).toBe(200);
    expect(body.length).toEqual(3);
    expect(body[0].id).toEqual(3);
  });

  test('Get all before', async () => {
    const { statusCode, body } = await request(app)
      .get(getAllMessagesUrl())
      .query({ before: '2019-05-29T18:22:59.900Z' });
    expect(statusCode).toBe(200);
    expect(body.length).toEqual(3);
    expect(body[0].id).toEqual(1);
    expect(body[2].id).toEqual(3);
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
    expect(body.length).toEqual(2);
    expect(body[0].id).toEqual(1);
  });

  test('Get channel messages from', async () => {
    const { body } = await request(app)
      .get(getMessagesUrl(1))
      .query({ from: '2019-05-29T18:22:59.900Z' })
      .expect(200);
    expect(body.length).toEqual(2);
    expect(body[0].id).toEqual(3);
  });

  test('Create', async (done) => {
    const dataFromClient = {
      message: 'oh my message',
    };
    const channelId = 3;

    const expectedResponse = {
      message: 'oh my message',
      channelId,
      author: {
        id: 1,
      },
    };
    socket.on('newMessage', (payload) => {
      if (payload.message === expectedResponse.message) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });

    const { statusCode, body } = await request(app)
      .post(getMessagesUrl(channelId))
      .set('Authorization', accessToken)
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
