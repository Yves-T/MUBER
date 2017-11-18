const express = require('express');

const router = express.Router();
const {
  greeting, create, edit, remove, index,
} = require('../controllers/driver_controller');

router.get('/api', greeting);

router.post('/api/drivers', create);

router.put('/api/drivers/:id', edit);

router.delete('/api/drivers/:id', remove);

router.get('/api/drivers', index);

module.exports = router;
