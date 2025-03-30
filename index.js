
import express from 'express';
import { middleware } from '@line/bot-sdk';
import dotenv from 'dotenv';
import { handleEvent } from './api/handlers/events.js'; 

dotenv.config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();

app.post('/webhook', middleware(config), async function (req, res) {
  const events = req.body.events;
  if (!events) {
    res.status(200).send('No events');
    return;
  }

  for (let i = 0; i < events.length; i++) {
    await handleEvent(events[i], process.env.CHANNEL_ACCESS_TOKEN);
  }

  res.status(200).send('OK');
});

app.listen(3000, function () {
  console.log('🚀 ローカルサーバー起動中：http://localhost:3000/webhook');
});
