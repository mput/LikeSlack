import request from 'supertest';
import io from 'socket.io-client';

import getApp from '..';

const apiUrl = '/api/v1';
let app;
let socket;

beforeEach((done) => {
  app = getApp().listen(0, () => {
    const httpServerAddr = app.address();
    socket = io(
      `http://localhost:${httpServerAddr.port}`,
      { forceNew: true, reconnect: false },
    );
    socket.on('ping', () => {
      done();
    });
  });
});

afterEach((done) => {
  socket.close();
  app.close(() => {
    done();
  });
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
        attributes: {
          name: 'ChannelName',
        },
      },
    };
    const expectedResponse = {
      data: {
        type: 'channels',
        id: expect.any(Number),
        attributes: {
          name: 'ChannelName',
          id: expect.any(Number),
          removable: true,
        },
      },
    };

    socket.on('newChannel', (payload) => {
      expect(payload).toMatchObject(expectedResponse);
      done();
    });
    const { statusCode, body } = await request(app).post(getChannelsUrl()).send(dataFromClient);
    expect(statusCode).toBe(201);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Delete', async (done) => {
    const newChannelData = {
      data: {
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
      expect(payload).toMatchObject(expectedResponse);
      done();
    });
    await request(app).delete(getChannelUrl(channelId)).expect(204);
  });


  test('Update', async (done) => {
    const newChannelData = {
      data: {
        attributes: {
          name: 'ChannelName',
        },
      },
    };
    const renameChannelData = {
      data: {
        attributes: {
          name: 'NewChannelName',
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
          id: channelId,
          name: 'NewChannelName',
        },
      },
    };
    socket.on('renameChannel', (payload) => {
      expect(payload).toMatchObject(expectedResponse);
      done();
    });
    await request(app).patch(getChannelUrl(channelId)).send(renameChannelData).expect(204);
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
        },
      },
    };

    const expectedResponse = {
      data: {
        type: 'messages',
        id: expect.any(Number),
        attributes: {
          message: 'oh my message',
          author: 'UserOne',
          id: expect.any(Number),
        },
      },
    };
    socket.on('newMessage', (payload) => {
      expect(payload).toMatchObject(expectedResponse);
      done();
    });

    const { statusCode, body } = await request(app)
      .post(getMessagesUrl(channelId)).send(dataFromClient);
    expect(statusCode).toBe(201);
    expect(body).toMatchObject(expectedResponse);
  });

  test('Get', async () => {
    const dataFromClient = {
      data: {
        attributes: {
          message: 'oh my message',
          author: 'UserOne',
        },
      },
    };
    await request(app)
      .post(getMessagesUrl(channelId)).send(dataFromClient);
    await request(app)
      .post(getMessagesUrl(channelId)).send(dataFromClient);
    const { statusCode, body } = await request(app)
      .get(getMessagesUrl(channelId));
    expect(statusCode).toBe(200);
    expect(body.length).toBe(2);
  });
});
