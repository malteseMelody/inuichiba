// lib/env.js



// Node.jsに.env.xxxを開発環境に応じて読み込ませる
import { config as loadEnv } from 'dotenv';
const envPath = process.env.NODE_ENV === "production"
  ? ".env.production"
  : ".env.dev";
loadEnv({ path: envPath });

// 環境識別を NODE_ENV / VERCEL_ENV のどちらでも判定できるようにする
const rawEnv = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
if (!rawEnv) {
  throw new Error(
    "❌ VERCEL_ENV または NODE_ENV が定義されていません。\n" +
    "Vercelでは自動設定されますが、ローカル実行時には `NODE_ENV=production` を指定してください。"
  );
}

// 本番判定
export const isProd = rawEnv === "production";
export const isPreview = rawEnv === "preview";
export const isDev = rawEnv === "development";		// おまけ・未使用

console.log("🐾 VERCEL_ENV:", process.env.VERCEL_ENV);
console.log("🐾 NODE_ENV:", process.env.NODE_ENV);
console.log("🐾 判定結果 → envName:", envName);
console.log("🐾 isProd:", isProd);
console.log("🐾 isPreview:", isPreview);
console.log("🔍 使用されている channelSecret:", channelSecret ? "✅ OK" : "❌ NG");


// ログ用
export const envName = rawEnv;

// 本番環境と開発環境に応じて切り分ける
export const channelAccessToken = isProd
  ? process.env.CHANNEL_ACCESS_TOKEN_PROD
  : process.env.CHANNEL_ACCESS_TOKEN_DEV;

export const channelSecret = isProd
  ? process.env.CHANNEL_SECRET_PROD
  : process.env.CHANNEL_SECRET_DEV;

console.log("🧪 channelSecret:", channelSecret);

// 固定ディレクトリ（画像・動画・カルーセルメッセージ）
// isProdがtrue(本番)なら https://inuichiba.vercel.app/ をbaseDirに入れる
export const baseDir = isProd
  ? "https://inuichiba.vercel.app/"
  : "https://dev-inuichiba.vercel.app/";

// 使用する Supabase テーブル名を、環境によって切り替える
// 本番なら users_prod、Preview なら users_dev を使用
export const usersTable = isProd
  ? process.env.SUPABASE_TABLE_NAME_PROD
  : process.env.SUPABASE_TABLE_NAME_DEV;

export const supabaseKey = isProd
  ? process.env.SUPABASE_SERVICE_ROLE_KEY_PROD
  : process.env.SUPABASE_SERVICE_ROLE_KEY_DEV;

export const supabaseUrl = process.env.SUPABASE_URL;

if (!isProd) {
  console.log(isProd ? "🚀 Supabase 本番環境チェック:" : "🧪 Supabase 開発環境チェック:");
  console.log("🔍 envName:", envName);
  console.log("🗝️ supabaseKey（使用中のキー）:", supabaseKey ? "✅ OK" : "❌ NG");
  console.log("📦 usersTable:", usersTable);
}

// LINEからSupabaseに書き込まれるときのuserId。確認にひとつは必須
export const myLineUserId = process.env.MY_LINE_USER_ID;

export const targetMenuName = process.env.TARGET_MENU_NAME;

