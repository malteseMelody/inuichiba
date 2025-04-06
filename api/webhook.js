// api/webhook.js
export default function handler(req, res) {
  console.log("✅ webhook base handler reached!");
  res.status(200).json({ status: "bare minimum webhook works" });
}
