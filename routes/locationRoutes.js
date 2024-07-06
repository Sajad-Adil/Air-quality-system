const express = require('express');
const { createLocation, getLocations } = require('../controllers/locationController');

const router = express.Router();

router.post('/locations', createLocation);
router.get('/locations', getLocations);

module.exports = router;
