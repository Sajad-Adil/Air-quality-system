const Reading = require('../models/Reading');

const ensureValidJSON = (message) => {
  
  return message.replace(/"air_quality_label": (\w+)/, '"air_quality_label": "$1"');
};

const saveReading = async (message) => {
  try {
    console.log('Received message:', message);
    const validMessage = ensureValidJSON(message);
    const data = JSON.parse(validMessage);


    if (
      typeof data.tempC !== 'number' ||
      typeof data.humi !== 'number' ||
      typeof data.dsm_consentrate !== 'number' ||
      typeof data.dsm_particle !== 'number' ||
      typeof data.air_quality_label !== 'string' ||
      typeof data.sensor_value !== 'number'
    ) {
      throw new Error('Invalid data format');
    }

    const newReading = new Reading({
      deviceId: data.deviceId || 'default_device_id',
      locationId: data.locationId || 'default_location_id',
      timestamp: new Date(),
      tempC: data.tempC,
      humi: data.humi,
      dsm_consentrate: data.dsm_consentrate,
      dsm_particle: data.dsm_particle,
      air_quality_label: data.air_quality_label,
      sensor_value: data.sensor_value
    });

    await newReading.save();
    console.log('Reading saved successfully');
  } catch (err) {
  
    console.error('Error saving reading:', err);
    console.error('Message that caused the error:', message);
  }
};

const getReadings = async (req, res) => {
  try {
    const readings = await Reading.find();
    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistoricalData = async (req, res) => {
  try {
    const { start, end } = req.query;
    const readings = await Reading.find({
      timestamp: { $gte: new Date(start), $lte: new Date(end) }
    });
    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { start, end } = req.query;
    const readings = await Reading.find({
      timestamp: { $gte: new Date(start), $lte: new Date(end) }
    });

    if (readings.length === 0) {
      return res.status(200).json({ message: 'No data found for the given period' });
    }
    const statistics = {
      avgTempC: readings.reduce((sum, r) => sum + r.tempC, 0) / readings.length,
      maxTempC: Math.max(...readings.map(r => r.tempC)),
      minTempC: Math.min(...readings.map(r => r.tempC)),
      avgHumi: readings.reduce((sum, r) => sum + r.humi, 0) / readings.length,
      maxHumi: Math.max(...readings.map(r => r.humi)),
      minHumi: Math.min(...readings.map(r => r.humi)),
      avgDsmConsentrate: readings.reduce((sum, r) => sum + r.dsm_consentrate, 0) / readings.length,
      maxDsmConsentrate: Math.max(...readings.map(r => r.dsm_consentrate)),
      minDsmConsentrate: Math.min(...readings.map(r => r.dsm_consentrate)),
      avgDsmParticle: readings.reduce((sum, r) => sum + r.dsm_particle, 0) / readings.length,
      maxDsmParticle: Math.max(...readings.map(r => r.dsm_particle)),
      minDsmParticle: Math.min(...readings.map(r => r.dsm_particle))
    };

    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { getHistoricalData, getStatistics, saveReading, getReadings };


