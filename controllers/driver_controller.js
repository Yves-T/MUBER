const Driver = require('../models/driver');
const { to } = require('await-to-js');

module.exports = {
  greeting(req, res) {
    res.json({ message: 'hello world' });
  },
  async index(req, res, next) {
    const { lng, lat } = req.query;
    const [err, drivers] = await to(Driver.geoNear(
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      { spherical: true, maxDistance: 200000 }, // in meters
    ));
    if (err) {
      next(err);
      return;
    }
    res.json(drivers);
  },
  async create(req, res, next) {
    const driverProps = req.body;
    const [err, driver] = await to(Driver.create(driverProps));
    if (err) {
      next(err);
      return;
    }
    res.send(driver);
  },
  async edit(req, res, next) {
    let err = null;
    let driver = null;
    const driverId = req.params.id;
    const driverProps = req.body;

    [err] = await to(Driver.findByIdAndUpdate({ _id: driverId }, driverProps));
    [err, driver] = await to(Driver.findById({ _id: driverId }));
    if (err) {
      next(err);
      return;
    }
    res.json(driver);
  },
  async remove(req, res, next) {
    let err = null;
    const driverId = req.params.id;

    [err] = await to(Driver.remove({ _id: driverId }));
    if (err) {
      next(err);
      return;
    }
    res.status(204).json({ message: `Driver with id ${driverId} is removed` });
  },
};
