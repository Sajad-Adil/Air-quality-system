const Device = require('../models/Device');

const createDevice = async (req, res) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate('location');
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createDevice, getDevices };
