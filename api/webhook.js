// api/webhook.js

import { middleware } from "@line/bot-sdk";
import {
  channelAccessToken,
  channelSecret,
  envName
} from "../lib/env.js";

console.log("✅ webhook base handler reached!");
console.log("🔍 環境:", envName);
console.log("🔍 シークレット:", channelSecret);

const lineMiddleware = middleware({
  channelAccessToken,
  channelSecret
});

export const config = {
  api: {
    bodyParser: false, // ← LINE公式が推奨
  },
};

export default async function handler(req, res) {
  console.log("📩 webhook handler triggered:", req.method);

  await new Promise((resolve, reject) => {
    lineMiddleware(req, res, (err) => {
      if (err) {
        console.error("❌ Middleware署名エラー:", err.message);
        res.status(401).send("Unauthorized");
        reject(err);
      } else {
        console.log("✅ Middleware署名 OK");
        resolve();
      }
    });
  });

  res.status(200).send("Webhook Middleware passed");
}
