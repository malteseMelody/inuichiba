// lib/env.js

// Vercel が自動的に設定する環境変数 VERCEL_ENV から現在の環境を取得する
// fallback（代わり）として、ローカル開発などで VERCEL_ENV が未定義のときは "development" を使う
export const env = process.env.VERCEL_ENV || "development";

// 本番環境かどうかを判定する（VERCEL_ENV が "production" のとき）
export const isProd = env === "production";

// Preview 環境かどうかを判定する（VERCEL_ENV が "preview" のとき）
export const isPreview = env === "preview";

// 中身は "production" / "preview" / "development" のどれか
export const envName = env;

// 本番環境と開発環境に応じて切り分ける
export const channelAccessToken = isProd
  ? process.env.CHANNEL_ACCESS_TOKEN_PROD
  : process.env.CHANNEL_ACCESS_TOKEN_DEV;

export const channelSecret = isProd
  ? process.env.CHANNEL_SECRET_PROD
  : process.env.CHANNEL_SECRET_DEV;

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

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const myLineUserId = process.env.MY_LINE_USER_ID;

export const targetMenuName = process.env.TARGET_MENU_NAME;

