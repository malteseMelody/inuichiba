
import express from 'express';
import { middleware } from '@line/bot-sdk';
import { handleEvent } from './api/handlers/events.js'; 
import { channelAccessToken } from "./lib/env.js";

import dotenv from 'dotenv';
dotenv.config();

const config = {
  channelAccessToken,
  channelSecret,
};

const app = express();

app.post('/webhook', middleware(config), async function (req, res) {
  const events = req.body.events;
  if (!events) {
    res.status(200).send('No events');
    return;
  }

  for (let i = 0; i < events.length; i++) {
    await handleEvent(events[i], channelAccessToken);
  }

  res.status(200).send('OK');
});

app.listen(3000, function () {
  console.log('🚀 ローカルサーバー起動中：http://localhost:3000/webhook');
});
