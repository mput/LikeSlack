import request from 'supertest';
import getApp from '..';

const app = getApp();

describe('Root page', () => {
  test('root page should answer', async () => {
    const respond = await request(app).get('/');
    expect(respond.statusCode).toBe(200);
  });
});
