import 'dotenv/config.js'; // ← dotenvをESM風に書く方法（import形式で統一）
import { middleware } from '@line/bot-sdk';
import { handleEvent } from './handlers/events.js';

// LINE botの設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// ミドルウェアを準備
const lineMiddleware = middleware(config);

// Vercel用エクスポート関数（アロー関数なし）
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // ミドルウェアをPromiseで包む
    await new Promise(function (resolve, reject) {
      lineMiddleware(req, res, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const events = req.body.events;

    if (!events) {
      res.status(200).send('No events');
      return;
    }

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      await handleEvent(event, process.env.CHANNEL_ACCESS_TOKEN);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).send('Error');
  }
}
