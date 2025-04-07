// api/webhook.js

export default function handler(req, res) {
  console.log("📩 webhook handler triggered:", req.method);
  res.status(200).json({ message: "✅ Webhook base OK" });
}
// Touch for redeploy
