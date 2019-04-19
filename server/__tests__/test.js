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
      `http://[${httpServerAddr.address}]:${httpServerAddr.port}`,
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
  test('Create', async (done) => {
    const channelsUrl = `${apiUrl}/channels`;
    const dataSample = {
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
    const { statusCode, body } = await request(app).post(channelsUrl).send(dataSample);
    expect(statusCode).toBe(201);
    expect(body).toMatchObject(expectedResponse);
  });
});
