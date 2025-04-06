// api/webhook.js

import { envName } from '../lib/env.js';

export default function handler(req, res) {
  console.log("✅ webhook handler 起動");
  console.log("🔍 環境:", envName);
  res.status(200).json({ status: "webhook restored!" });
}
