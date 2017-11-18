/* eslint no-unused-expressions: 0 */
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  it('POST request to /api/drivers creates a new driver', async () => {
    const countBefore = await Driver.count();
    await request(app)
      .post('/api/drivers')
      .send({ email: 'test@test.com' });
    const countAfter = await Driver.count();
    expect(countBefore + 1).to.be.equal(countAfter);
  });
  it('PUT to /api/drivers/id should update driver', async () => {
    const driver = new Driver({ email: 't@t.com', driving: false });
    await driver.save();
    await request(app)
      .put(`/api/drivers/${driver._id}`)
      .send({ driving: true });
    const foundDriver = await Driver.findOne({ email: 't@t.com' });
    expect(foundDriver.driving).to.be.true;
  });
  it('DELETE to /api/drivers/id should delete driver', async () => {
    const driver = new Driver({ email: 't@t.com', driving: false });
    await driver.save();
    let foundDriver = await Driver.findOne({ email: 't@t.com' });
    expect(foundDriver).to.exist;
    await request(app).delete(`/api/drivers/${driver._id}`);
    foundDriver = await Driver.findOne({ email: 't@t.com' });
    expect(foundDriver).to.not.exist;
  });
  it('GET to /api/drivers finds drivers in a location', async () => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: {
        type: 'Point',
        coordinates: [-122.4759902, 47.6147628],
      },
    });
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: {
        type: 'Point',
        coordinates: [-80.253, 25.791],
      },
    });
    await Promise.all([seattleDriver.save(), miamiDriver.save()]);
    const response = await request(app).get('/api/drivers?lng=-80&lat=25');
    expect(response.body.length).to.equal(1);
    expect(response.body[0].obj.email === 'miami');
  });
});
