// api/webhook.js

import { middleware } from "@line/bot-sdk";
import { handleEvent } from "./handlers/events.js";
import {
  channelAccessToken,
  channelSecret,
  envName
} from "../lib/env.js";

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
  console.log("✅ Webhook関数に到達！");
  console.log("🔍 環境:", envName);
	console.log("📩 x-line-signature:", req.headers["x-line-signature"]);

  try {
    await new Promise((resolve, reject) => {
      lineMiddleware(req, res, (err) => {
        if (err) {
          console.error("❌ Middleware署名エラー:", err.message);
          res.status(401).send("Unauthorized");
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const events = req.body.events;
    if (!events || !Array.isArray(events)) {
      res.status(200).send("No events");
      return;
    }

    console.log("✅ イベント受信:", events.length, "件");

    for (const event of events) {
      await handleEvent(event, channelAccessToken);
    }

    res.status(200).send("OK from handler");

  } catch (error) {
    console.error("💥 Webhookクラッシュ:", error);
    res.status(500).send("Error in webhook");
  }
}
