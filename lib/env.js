// lib/env.js
// 変数定義 → 条件分岐 → ログの順が安全順序です！

// Node.jsに.env.xxxを開発環境に応じて読み込ませる
import { config as loadEnv } from 'dotenv';
// 1. .env読み込み
const envPath = process.env.NODE_ENV === "production"
  ? ".env.production"
  : ".env.dev";
loadEnv({ path: envPath });

// 環境識別を NODE_ENV / VERCEL_ENV のどちらでも判定できるようにする
// 2. 環境を判定（文字列）
const rawEnv = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
if (!rawEnv) {
  throw new Error(
    "❌ VERCEL_ENV または NODE_ENV が定義されていません。\n" +
    "Vercelでは自動設定されますが、ローカル実行時には `NODE_ENV=production` を指定してください。"
  );
}

// 3. フラグ変数
export const isProd = rawEnv === "production";
export const isPreview = rawEnv === "preview";
export const isDev = rawEnv === "development";		// おまけ・未使用


// 4. 他の設定値（isProdを使ってOK）
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

// LINEからSupabaseに書き込まれるときのuserId。確認にひとつは必須
export const myLineUserId = process.env.MY_LINE_USER_ID;

export const targetMenuName = process.env.TARGET_MENU_NAME;


// ✅ 最後に定義！ ← これが正解
// ログ用(読み込み順でまだ envName が未初期化の状態で使われてしまうとクラッシュするので最後に持ってくる)
export const envName = rawEnv;

// ✅ ログ出力（使うのは最後！）
// console.log() は定義後に！それ以前に使うと未初期化になる
if (!isProd) {
  console.log("🐾 VERCEL_ENV:", process.env.VERCEL_ENV);
  console.log("🐾 NODE_ENV:", process.env.NODE_ENV);
  console.log("🐾 環境判定（envName）:", envName);
  console.log("🐾 supabaseKey:", supabaseKey ? "✅ OK" : "❌ NG");
  console.log("🐾 usersTable:", usersTable);
}
	console.log("🔍 channelSecret:", channelSecret);
	console.log("🔍 使用 LINE Webhook URL:", req.url);
	console.log("🔍 使用 HTTP メソッド:", req.method);
	console.log("🔍 署名:", req.headers['x-line-signature']);
