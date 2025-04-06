// api/webhook.js

import * as ENV from '../lib/env.js';

export default function handler(req, res) {
  console.log("✅ webhook handler 起動");
  console.log("🔍 env module loaded:", ENV);
  res.status(200).json({ status: "env test OK" });
}
