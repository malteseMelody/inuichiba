// api/webhook.js

// 修正後の最小構成 webhook.js（Vercel に Function として認識させるため）

export default function handler(req, res) {
  console.log("✅ webhook.js base handler reached!");
  res.status(200).json({ message: "OK from webhook base" });
}
