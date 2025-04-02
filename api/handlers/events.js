import { handleRichMenu } from '../../richmenu-manager/richMenuHandler.js';
import { writeUserDataToSupabase } from "../../lib/writeUserDataToSupabase.js";
import { sendReplyMessage, getUserProfile } from '../../lib/lineApiHelpers.js';
import { textMessages, mediaMessages, textTemplates, emojiMap } from '../../richmenu-manager/data/messages.js';
import axios from 'axios';
import * as messages from '../../richmenu-manager/data/messages.js';


// ///////////////////////////////////////////
// eventタイプで処理を振り分ける
export async function handleEvent(event, ACCESS_TOKEN) {
  switch (event.type) {
    case 'message':
      await handleMessageEvent(event, ACCESS_TOKEN);
      break;
    case 'postback':
      await handlePostbackEvent(event, ACCESS_TOKEN);
      break;
    case 'follow':
      await handleFollowEvent(event, ACCESS_TOKEN);
      break;
    case 'unfollow':
      console.log("🔕 ユーザーがブロックしました:", event.source.userId);
      break;
    default:
      console.log('❓ Unhandled event type:', event.type);
  }
}

// ///////////////////////////////////////////
// followイベントの処理
async function handleFollowEvent(event, ACCESS_TOKEN) {
  let mBody;
  let message = [];

  const userId = event.source.userId;
  const groupId = event.source.groupId || null;
  const safeGroupId = groupId || "default";  // nullのときは"default"
  
  console.log("🟡 follow イベント開始:", { userId, groupId });
  
  const profile = await getUserProfile(userId, ACCESS_TOKEN);
  
  // プロフィールが取得できなかった場合はnull補完
  const displayName = profile?.displayName || null;
  const pictureUrl = profile?.pictureUrl || null;
  const statusMessage = profile?.statusMessage || null;
  const shopName = null;
  
  // 書き込み処理
　await writeUserDataToSupabase(groupId, userId, displayName, 
   							　  pictureUrl, statusMessage, shopName);								
  console.log("✅ Supabase 書き込み完了");								

  // フォローありがとうメッセージを作る
  const followText = textTemplates["msgFollow"];

  if (displayName == null || displayName.includes("$")) {
    mBody = followText;
  } else {
    mBody = `${displayName}さん、${followText}`;
  }

  try {
    const emojiTextMessage = buildEmojiMessage("msgFollow", mBody);
    message = emojiTextMessage;
  } catch (error) {
    console.warn(`⚠️ follow絵文字メッセージの構築失敗: ${error.message}`);
    message = { type: "text", text: "エラーが発生しました。" };
  }

  await sendReplyMessage(event.replyToken, [message], ACCESS_TOKEN);
}


// ///////////////////////////////////////////
// messageイベントの処理
async function handleMessageEvent(event, ACCESS_TOKEN) {
  let message = [];
  const data = event.message.text;

  if (data == "ワイワイ") {
    message = { type: "text", text: messages.msgY };
  } else {
    message = { type: "text", text: messages.msgPostpone };
  }

  await sendReplyMessage(event.replyToken, [message], ACCESS_TOKEN);
}

// ///////////////////////////////////////////
// postbackイベント：リッチメニューのタップ処理へ委譲
async function handlePostbackEvent(event, ACCESS_TOKEN) {
  if (event.postback.data.startsWith("tap_richMenu")) {
    await handleRichMenuTap(event.postback.data, event.replyToken, ACCESS_TOKEN);
    return;
  }

  if (event.postback.data == "change to A" || event.postback.data == "change to B") {
    return;
  }
}

// ///////////////////////////////////////////
// リッチメニュータップのバッチ処理
async function handleRichMenuTap(data, replyToken, ACCESS_TOKEN) {
  let messages = [];

  console.log("🔍 postback data:", data, "（型:", typeof data, "）");

  if (mediaMessages[data]) {
    messages = mediaMessages[data];
  } else if (textMessages[data]) {
    messages = textMessages[data];
  } else if (data == "tap_richMenuA5") {
    await setCarouselMessage(replyToken, ACCESS_TOKEN);
    return;
  }

  try {
    if (textTemplates[data]) {
      const emojiTextMessage = buildEmojiMessage(data, "");
      messages.push(emojiTextMessage);
    }
  } catch (error) {
    console.warn(`⚠️ Poskback絵文字メッセージの構築失敗: ${error.message}`);
  }

  if (messages.length === 0) {
    console.warn(`⚠️ Poskbackで情報が見つかりませんでした: ${data.toString()}`);
  }

  if (messages.length > 0) {
    console.log("Reply Token:", replyToken);
    console.log("送信メッセージ:", JSON.stringify(messages, null, 2));
    await sendReplyMessage(replyToken, messages, ACCESS_TOKEN);
  }
}


// ///////////////////////////////////////////// 
// テキストメッセージの後にカルーセルメッセージを出力する
async function setCarouselMessage(replyToken, ACCESS_TOKEN) {
  const textMessage = {
    type: "text",
    text: messages.msgA5
  };

  const flex_message1 = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "image",
          url: "https://inuichiba.vercel.app/carousel/cPark1.png",
          size: "full",
          aspectRatio: "1:1",
          aspectMode: "fit",
          action: {
            type: "uri",
            uri: "https://inuichiba.vercel.app/carousel/cPark1detail.png"
          }
        },
        {
          type: "text",
          text: "駐車場全体地図",
          align: "center",
          weight: "bold",
          size: "sm",
          color: "#333333"
        }
      ]
    },
    styles: {
      body: {
        backgroundColor: "#F3C2D5"
      }
    }
  };

  const flex_message2 = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "image",
          url: "https://inuichiba.vercel.app/carousel/cPark2.png",
          size: "full",
          aspectRatio: "1:1",
          aspectMode: "fit",
          action: {
            type: "uri",
            uri: "https://inuichiba.vercel.app/carousel/cPark2detail.png"
          }
        },
        {
          type: "text",
          text: "駐車場全体地図",
          align: "center",
          weight: "bold",
          size: "sm",
          color: "#333333"
        }
      ]
    },
    styles: {
      body: {
        backgroundColor: "#F3C2D5"
      }
    }
  };

  const flex_message3 = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "image",
          url: "https://inuichiba.vercel.app/carousel/cPark3.png",
          size: "full",
          aspectRatio: "1:1",
          aspectMode: "fit",
          action: {
            type: "uri",
            uri: "https://inuichiba.vercel.app/carousel/cPark3detail.png"
          }
        },
        {
          type: "text",
          text: "駐車場全体地図",
          align: "center",
          weight: "bold",
          size: "sm",
          color: "#333333"
        }
      ]
    },
    styles: {
      body: {
        backgroundColor: "#F3C2D5"
      }
    }
  };

  const carouselContents = [flex_message1, flex_message2, flex_message3];

  const flexMessage = {
    type: "flex",
    altText: "こちらはカルーセルメッセージです", 
    contents: {
      type: "carousel",
      contents: carouselContents
    }
  };
	
  console.log("📦 Flex Message 中身:", JSON.stringify(flexMessage, null, 2));
  console.log("🚀 実際に送るメッセージ:", [textMessage, flexMessage]);

  await sendReplyMessage(replyToken, [textMessage, flexMessage], ACCESS_TOKEN);
}


// /////////////////////////////////////////
// 絵文字入りメッセージを組み立てる
function buildEmojiMessage(templateKey, mBody) {
  let rawText = textTemplates[templateKey];
  const emojiList = emojiMap[templateKey];

  if (templateKey === "msgFollow") {
    rawText = mBody;
  }

  if (!rawText) {
    throw new Error(`テキストテンプレートが見つかりません: ${templateKey}`);
  }

  const placeholderCount = (rawText.match(/\$/g) || []).length;
  console.log("💡 placeholderCount ($の数):", placeholderCount);
  console.log("🔢 emojiList.length:", emojiList ? emojiList.length : 0);

  if (!emojiList || placeholderCount !== emojiList.length) {
    throw new Error(`$の数(${placeholderCount})とemojiListの数(${emojiList ? emojiList.length : 0})が一致しません: ${templateKey}`);
  }

  const emojis = [];
  let i = 0;
  let placeholderIndex = rawText.indexOf('$');  

  while (placeholderIndex !== -1) {
    emojis.push({
      index:     placeholderIndex,
      productId: emojiList[i].productId,
      emojiId:   emojiList[i].emojiId
    });

    placeholderIndex = rawText.indexOf("$", placeholderIndex + 1);
    i++;
  }

  console.log("📦 最終構築される emojis 配列:", emojis);
  console.log("✅ 最終返却メッセージ:", {
    type: "text",
    text: rawText,
    emojis: emojis
  });

  return {
    type: "text",
    text: rawText,
    emojis: emojis
  };
}

