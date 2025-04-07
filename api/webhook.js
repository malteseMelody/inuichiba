// api/webhook.js

export default async function handler(req, res) {
  console.log("✅ webhook base handler reached!");
  console.log("📩 webhook handler triggered:", req.method);
  console.log("📩 x-line-signature:", req.headers["x-line-signature"]);

  if (req.method !== "POST") {
    console.log("🚫 Not a POST request, skipping...");
    return res.status(200).send("OK (not POST)");
  }

  // ミドルウェア実行...（@line/bot-sdkのmiddlewareの処理）
  // ←既存の処理をこのあとに続けてください
}

