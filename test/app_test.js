const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');

it('handles a GET request to /api', async () => {
  const response = await request(app)
    .get('/api/')
    .send({ email: 'test@test.com' });
  expect(response.body.message).to.equal('hello world');
});
