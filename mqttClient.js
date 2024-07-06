const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const readingRoutes = require('./routes/readingRoutes');
const { newReading } = require('./controllers/readingController');

const connectDB = require('./config/dbConn');
connectDB();
const app = express();
app.use(bodyParser.json());

app.use('/api', readingRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const brokerUrl = 'mqtt://91.121.93.94:1883';
const client = mqtt.connect(brokerUrl);
const topic = 'aswar';

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', async (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  await newReading(message.toString());
});

client.on('error', (error) => {
  console.error('Connection error:', error);
  client.end();
});
