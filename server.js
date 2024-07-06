const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const readingRoutes = require('./routes/readingRoutes');
const registerRouter = require('./routes/registerRouter');
const { saveReading } = require('./controllers/readingController');
const deviceRoutes = require('./routes/deviceRoutes');
const locationRoutes = require('./routes/locationRoutes');
const corsOptions = require('./config/corsOptions');
const authRouter = require('./routes/authRouter');
//const { getReadings} = require('./controllers/readingController');
const connectDB = require('./config/dbConn');
connectDB();



const app = express();
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api', deviceRoutes);
app.use('/api', locationRoutes);
app.use("/api/register", registerRouter);
app.use("/api/auth", authRouter);
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/api/readings', readingRoutes);

// MQTT Client
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
  await saveReading(message.toString());
});

client.on('error', (error) => {
  console.error('Connection error:', error);
  client.end();
});


const wss = new WebSocketServer({ server });


const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });

  ws.on('message', (message) => {
    console.log('Received WebSocket message:', message);
  });
});


const broadcastToClients = (data) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
};

