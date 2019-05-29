import request from 'supertest';
import io from 'socket.io-client';
// import db from '../db';

import getApp from '..';

const app = getApp();
const apiUrl = '/api/v1';

let socket;

beforeAll(async (done) => {
  // await db.migrate.latest();
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
  // await db.destroy();
  app.close(() => {
    done();
  });
});

beforeEach(async () => {
  // await db.seed.run();
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
  let channelId;

  beforeEach(async () => {
    const getChannelsUrl = () => `${apiUrl}/channels`;
    const newChannelData = {
      data: {
        attributes: {
          name: 'ChannelName',
        },
      },
    };
    const {
      body: {
        data: { id },
      },
    } = await request(app).post(getChannelsUrl()).send(newChannelData);
    channelId = id;
  });

  test('Create', async (done) => {
    const dataFromClient = {
      data: {
        attributes: {
          message: 'oh my message',
          author: 'UserOne',
          channelId,
        },
      },
    };

    const expectedResponse = {
      data: {
        type: 'messages',
        id: expect.any(String),
        attributes: {
          message: 'oh my message',
          author: 'UserOne',
          channelId,
        },
      },
    };
    socket.on('newMessage', (payload) => {
      if (payload.data.attributes.message === expectedResponse.data.attributes.message) {
        expect(payload).toMatchObject(expectedResponse);
        done();
      }
    });

    const { statusCode, body } = await request(app)
      .post(getMessagesUrl(channelId)).send(dataFromClient);
    expect(body).toMatchObject(expectedResponse);
    expect(statusCode).toBe(201);
  });

//   test('Get', async () => {
//     const dataFromClient = {
//       data: {
//         attributes: {
//           message: 'oh my message',
//           author: 'UserOne',
//         },
//       },
//     };
//     await request(app)
//       .post(getMessagesUrl(channelId)).send(dataFromClient);
//     await request(app)
//       .post(getMessagesUrl(channelId)).send(dataFromClient);
//     const { statusCode, body } = await request(app)
//       .get(getMessagesUrl(channelId));
//     expect(statusCode).toBe(200);
//     expect(body.length).toBe(2);
//   });
});
