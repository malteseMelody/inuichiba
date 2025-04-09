// lib/env.js
// 変数定義 → 条件分岐 → ログの順が安全順序です！

// Node.jsに.env.xxxを開発環境に応じて読み込ませる
import { config as loadEnv } from 'dotenv';

// 1. 環境ファイルの読み込み（ローカル用）
// Vercelでは .env.*を使わず、環境変数を自動で読み込むためローカルのためだけに必要
// (環境変数NODE_ENVは本番環境のみvercelがproducttionを入れて自動生成)
const envPath = process.env.NODE_ENV === "production"
  ? ".env.production"
  : ".env.dev";
loadEnv({ path: envPath });


// 2. Vercelの自動環境変数で判定
const rawEnv = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development';


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

// 使用する Supabase テーブル名を、環境によって切り替える
// 本番なら users_prod、Preview なら users_dev を使用
export const usersTable = isProd
  ? process.env.SUPABASE_TABLE_NAME_PROD
  : process.env.SUPABASE_TABLE_NAME_DEV;

export const supabaseKey = isProd
  ? process.env.SUPABASE_SERVICE_ROLE_KEY_PROD
  : process.env.SUPABASE_SERVICE_ROLE_KEY_DEV;

export const supabaseUrl = process.env.SUPABASE_URL;

// LINEのuserId。Supabaseに書き込まれるときのuserId。確認にひとつは必須
export const myLineUserId = process.env.MY_LINE_USER_ID;

// 固定ディレクトリ（画像・動画・カルーセルメッセージ）
// isProdがtrue(本番)なら https://inuichiba.vercel.app/ をbaseDirに入れる
export const baseDir = isProd
  ? "https://inuichiba.vercel.app/"
  : "https://dev-inuichiba.vercel.app/";

// ローカルテスト用で現在未使用。
// .env.productionと.dnv.devのみ定義。もちろんvercelの環境変数には未定義。
export const targetMenuName = process.env.TARGET_MENU_NAME;


// ✅ 最後に定義！ ← これが正解
// ログ用(読み込み順でまだ envName が未初期化の状態で使われてしまうとクラッシュするので最後に持ってくる)
export const envName = rawEnv;

// ✅ ログ出力（使うのは最後！）
// console.log() は定義後に！それ以前に使うと未初期化になる
if (!isProd) {
  console.log("🐾 環境判定された envName:", envName);
	console.log("🔐 channelSecret:", channelSecret);
	console.log("📦 Supabase URL:", supabaseUrl);
  console.log("📦 Supabase Table(usersTable):", usersTable);
  console.log("📦 supabaseKey:", supabaseKey ? "✅ OK" : "❌ NG");
}



