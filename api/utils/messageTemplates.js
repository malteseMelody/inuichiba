import { sendReplyMessage } from '../utils/lineApiHelpers.js';
import { textMessages, mediaMessages, textTemplates, emojiMap } from '../../richmenu-manager/data/messages.js';
import * as messages from '../../richmenu-manager/data/messages.js';

// ///////////////////////////////////////////// 
// テキストメッセージの後にカルーセルメッセージを出力する
export async function setCarouselMessage(replyToken, ACCESS_TOKEN) {
  const textMessage = {
    type: "text",
    text: messages.msgA4
  };

  const flex_message1 = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "image",
          url: "https://inuichiba.vercel.app/carousel/cPark1.jpg",
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
export function buildEmojiMessage(templateKey, mBody) {
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
