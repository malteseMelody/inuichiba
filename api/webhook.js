// api/webhook.js

import { middleware } from "@line/bot-sdk";
import { handleEvent } from "./handlers/events.js";
import { channelAccessToken, channelSecret, envName } from "../lib/env.js";

console.log("✅ webhook base handler reached!");
console.log("🐾 環境:", envName);

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
  console.log("📩 x-line-signature:", req.headers?.["x-line-signature"]);

  if (req.method !== "POST") {
    res.status(200).send("OK (not POST)");
    return;
  }

  try {
    await new Promise((resolve, reject) => {
      lineMiddleware(req, res, (err) => {
        if (err) {
          console.error("❌ Middleware署名エラー:", err.message);
          res.status(401).send("Unauthorized");
          return reject(err);
        }
        return resolve();
      });
    });

    const events = req.body?.events || [];
    console.log("✅ イベント受信:", events.length, "件");

    for (const event of events) {
      await handleEvent(event, channelAccessToken);
    }

    res.status(200).send("OK from handler");
  } catch (err) {
    console.error("💥 Webhookクラッシュ:", err);
    res.status(500).send("Error in webhook");
  }
}
