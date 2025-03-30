import { handleRichMenu } from '../../richmenu-manager/richMenuHandler.js';
import { writeUserDataToSupabase } from "./writeUserDataToSupabase.js";
import { sendReplyMessage, getUserProfile } from '../utils/lineApiHelpers.js';
import { setCarouselMessage, buildEmojiMessage } from '../utils/messageTemplates.js';
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
  
  const profile = await getUserProfile(userId, ACCESS_TOKEN);
  
  // プロフィールが取得できなかった場合はnull補完
  const displayName = profile?.displayName || null;
  const pictureUrl = profile?.pictureUrl || null;
  const statusMessage = profile?.statusMessage || null;
  
  // 書き込み処理
  await writeUserDataToSupabase(timestamp, groupId, userId, 
								displayName, pictureUrl, statusMessage);

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
    messages.push({ type: "text", text: textMessages[data] });
    console.log("送信予定テキスト: ", textMessages[data]);
  } else if (data == "tap_richMenuA4") {
    console.log("🎯 tap_richMenuA4 マッチしました");
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
