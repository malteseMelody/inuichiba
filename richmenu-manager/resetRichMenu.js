// 実行コマンド→　node richmenu-manager/resetRichMenu.js

import 'dotenv/config.js';
import { deleteRichMenusAndAliases } from './deleteAllRichMenus.js';
import { handleRichMenu } from './richMenuHandler.js';

const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

// メイン処理
async function main() {
  console.log("🔁 リッチメニュー初期化開始");

  await deleteRichMenusAndAliases();
  console.log("🗑️ 既存リッチメニュー削除完了");

  await handleRichMenu(ACCESS_TOKEN);
  console.log("✅ リッチメニュー再作成完了");
}

main();
