// api/webhook.js
import { middleware } from '@line/bot-sdk';
import { channelAccessToken, channelSecret } from '../lib/env.js';
import { handleEvent } from './handlers/events.js';

const lineConfig = {
  channelAccessToken,
  channelSecret,
};
const lineMiddleware = middleware(lineConfig);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("📩 webhook handler triggered:", req.method);

  if (req.method !== "POST") {
    console.log("🚫 Not a POST request, skipping...");
    return res.status(200).send("OK (not POST)");
  }

  try {
    await new Promise((resolve, reject) => {
      lineMiddleware(req, res, (err) => {
        if (err) {
          console.error("❌ Middleware error:", err.message);
          res.status(401).send("Unauthorized");
          return reject(err);
        }
        resolve();
      });
    });

    const events = req.body?.events;
    if (!events || !Array.isArray(events)) {
      return res.status(200).send("No events");
    }

    for (const event of events) {
      await handleEvent(event);
    }

    res.status(200).send("OK from webhook");
  } catch (err) {
    console.error("💥 Error in webhook handler:", err);
    res.status(500).send("Internal Server Error");
  }
}

// 🔄 強制更新用コメント


