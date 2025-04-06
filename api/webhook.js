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

export default function handler(req, res) {
  res.status(200).json({ status: "middleware loaded, still OK" });
}
