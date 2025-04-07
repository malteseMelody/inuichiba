// api/webhook.js
export default function handler(req, res) {
  console.log("✅ webhook base handler reached!");
  console.log("📩 webhook handler triggered:", req.method);
  console.log("📩 x-line-signature:", req.headers?.["x-line-signature"]);

  if (req.method === "POST") {
    res.status(401).send("Unauthorized");
  } else {
    res.status(200).send("OK (not POST)");
  }
}
