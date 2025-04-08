// 開発時のみ実行　node richmenu-manager/testRichMenuLink.js

// richmenu-manager/testRichMenuLink.js

import 'dotenv/config';
import line from '@line/bot-sdk';

const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

const userId = process.env.MY_LINE_USER_ID;
const menuName = process.env.TARGET_MENU_NAME;

// richMenu名からrichMenuIdを取得する関数
async function getRichMenuIdByName(targetName) {
  const menus = await client.getRichMenuList();

  console.log('📋 登録済みリッチメニュー一覧:');
  menus.forEach(menu => {
    console.log(`- ${menu.name}: ${menu.richMenuId}`);
  });

  const found = menus.find(menu => menu.name === targetName);
  if (!found) {
    throw new Error(`❌ メニュー「${targetName}」が見つかりませんでした`);
  }

  return found.richMenuId;
}

async function linkRichMenuByName() {
  try {
    const richMenuId = await getRichMenuIdByName(menuName);

    await client.unlinkRichMenuFromUser(userId);
    console.log('✅ unlink 成功');

    await client.linkRichMenuToUser(userId, richMenuId);
    console.log(`✅ リッチメニュー「${menuName}」をリンクしました`);
  } catch (err) {
    console.error('❌ エラー:', err.originalError?.response?.data || err);
  }
}
