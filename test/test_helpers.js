const mongoose = require('mongoose');

function to(promise) {
  return promise.then(data => [null, data]).catch(err => [err]);
}

before(async () => {
  mongoose.connect('mongodb://localhost/muber_test', { useMongoClient: true });
  await mongoose.connection;
});

beforeEach(async () => {
  const { drivers } = mongoose.connection.collections;
  const [err, user] = await to(drivers.drop());
  drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' });
  // first time it runs, an error is generated because there is no collection
  // to drop yet. It must be catched otherwise the app crashes.
  if (err) {
    return err;
  }
  return user;
});
