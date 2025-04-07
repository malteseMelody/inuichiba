// api/webhook.js

import { middleware } from '@line/bot-sdk';
import { channelSecret } from '../lib/env.js'; // 自分のenv読み込み方法に合わせて修正

const lineMiddleware = middleware({ channelSecret });

export const config = {
  api: {
    bodyParser: false, // LINE Bot用に必要
  },
};

export default async function handler(req, res) {
  console.log("✅ webhook base handler reached!");
  console.log("📩 webhook handler triggered:", req.method);
  console.log("📩 x-line-signature:", req.headers["x-line-signature"]);

  if (req.method !== "POST") {
    console.log("🚫 Not a POST request, skipping...");
    return res.status(200).send("OK (not POST)");
  }

  // LINE SDK の middleware を使って署名を検証
  await new Promise((resolve, reject) => {
    lineMiddleware(req, res, (err) => {
      if (err) {
        console.error("❌ Middleware署名エラー:", err.message);
        res.status(401).send("Unauthorized");
        return reject(err);
      }
      resolve();
    });
  });

  // 仮の応答（テスト）
  res.status(200).send("✅ POST OK");
}
