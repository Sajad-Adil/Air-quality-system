const express = require('express');
const router = express.Router();
const { saveReadings } = require('../controllers/readingController');
const { getReadings} = require('../controllers/readingController');
router.get('/', getReadings);
//router.post('/readings', saveReadings);
const { getHistoricalData, getStatistics } = require('../controllers/readingController');

router.get('/historical', getHistoricalData);
router.get('/statistics', getStatistics);
module.exports = router;
