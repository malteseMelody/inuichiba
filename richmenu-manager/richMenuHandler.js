
// 最初に以下のコマンドをターミナルのプロジェクトのルートディレクトリで実行
// npm install @line/bot-sdk

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Client } from '@line/bot-sdk'; 
import { channelAccessToken } from "../lib/env.js";

// __dirname の再現（ESM用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// LINE Bot SDKの初期設定
const client = new Client({
  channelAccessToken
});



// //////////////////////////////////////////////////
// リッチメニューのサイズ
// 次の条件をクリアすること
// ・横幅は800px～2500px 縦幅は250px以上
// ・幅/高さのアスペクト比は1.45以上
const wAll  = 2000;
const hAll  = 1200;
const wItem =  500;
const hItem =  500;
const wTab  = 1000;
const hTab  =  200;


// //////////////////////////////////////////////////
// リッチメニューの開始
// 古いリッチメニューを削除し新しいリッチメニューを作成する
// ここはメッセージを出さない
// ファイルやリッチメニュー系のプログラムを修正したらここを実行すること
export async function handleRichMenu() {
  try {
  	// 今迄あったリッチメニューを削除
// 	await deleteRichMenusAndAliases();
  	
  	// リッチメニューを作成してリッチメニューIDを紐づける(リンクする)
  	const aRichMenuId = await aCreateRichMenu();
  	const bRichMenuId = await bCreateRichMenu(); 
	
	if (!aRichMenuId || !bRichMenuId) {
		console.error("❌ リッチメニューIDが取得できませんでした。処理を中止します。");
		return;	
	}	
  	
  	// リッチメニューに画面を紐づける
  	// 既定値の画面を決める(最初にどちらのタブを出すか)
  	// エイリアスを設定する(タブ同士の行き来を可能にする)
  	await createRichMenus(aRichMenuId, bRichMenuId);
  	
  	return;
  	
	} catch (error) {
    	console.error('リッチメニューメインエラー:', error);
  }  
  	
}


// ///////////////////////////////////////
// リッチメニュー(タブA)の各タップ領域の定義
async function aCreateRichMenu() {
	try {
    const richmenuA = {
    	size: { width: wAll, height: hAll },
    	selected: true,
    	name: "タブＡ(左側メニュー)2025秋",  // バージョン管理用。.env.xx..xxに書いてLINEのキャッシュを強制的に削除するときにも使う
    	chatBarText: "メニュー(表示/非表示)",
    	areas: [
      	// タブA(左側のタブ)がタップされたらタブA画面に遷移する
        {
          bounds: { x: 0, y: 0, width: wTab, height: hTab },
          action: { type: "richmenuswitch", richMenuAliasId: "switch-to-a", data: "change to A" }
        },
      	// タブB(右側のタブ)がタップされたらタブB画面に遷移する
        {
          bounds: { x: wTab, y: 0, width: wTab, height: hTab },
          action: { type: "richmenuswitch", richMenuAliasId: "switch-to-b", data: "change to B" }
        },
      	// A1
        {
          bounds: { x: 0, y: hTab, width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuA1" }
        },
	    // A2
        {
          bounds: { x: wItem, y: hTab, width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuA2" }
        },
      	// 指定されたurlを開く
        {
          bounds: { x: wItem*2, y: hTab, width: wItem*2, height: hItem },
          action: { type: "uri", uri: "https://inuichiba.com/index.html" }
        },
	      
  	    // A3
        {
          bounds: { x: 0, y: (hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuA3" }
        },
	    // A4
        {
          bounds: { x: wItem, y: (hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuA4" }
        },
	    // A5
        {
          bounds: { x: wItem*2, y: (hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuA5" }
        },
	    // A6
        {
          bounds: { x:wItem*3, y: (hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuA6" }
        }
    	]
	};
  	
  	// リッチメニューを作りIdをもらう
  	const aRichMenuId = await client.createRichMenu(richmenuA);
  	console.log('aRichMenuId作成成功: ', aRichMenuId);
  	
  	return(aRichMenuId);
  	
	} catch (error) {
    	console.error('aRichMenuId作成エラー:', error);
  }  
  
}


// //////////////////////////////////////////////////
// リッチメニュー(タブB)の各タップ領域の定義
async function bCreateRichMenu() {
	try {
    const richmenuB = {
    	size: { width: wAll, height: hAll },
    	selected: true,
    	name: "タブＢ(右側メニュー)2025秋",
    	chatBarText: "メニュー(表示/非表示)",
    	areas: [
      	// タブA(左側のタブ)がタップされたらタブA画面に遷移する
        {
          bounds: { x: 0, y: 0, width: wTab, height: hTab },
          action: { type: "richmenuswitch", richMenuAliasId: "switch-to-a", data: "change to A" }
        },
      	// タブB(右側のタブ)がタップされたらタブB画面に遷移する
        {
          bounds: { x: wTab, y: 0, width: wTab, height: hTab },
          action: { type: "richmenuswitch", richMenuAliasId: "switch-to-b", data: "change to B" }
        },
        // B1
        {
          bounds: { x: 0, y: hTab, width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuB1" }
        },
        // B2
        {
          bounds: { x: wItem, y: hTab, width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuB2" }
        },
      	// 指定されたurlを開く
        {
          bounds: { x: wItem*2, y: hTab, width: wItem*2, height: hItem },
          action: { type: "uri", uri: "https://inuichiba.com/index.html" }
        },
	      
  	    // B3
        {
          bounds: { x: 0, y: (hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuB3" }
        },
	    // B4
        {
          bounds: { x: wItem, y: (hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuB4" }
        },
	    // B5
        {
          bounds: { x: wItem*2, y: (hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuB5" }
        },
	    // B6
        {
          bounds: { x:wItem*3, y:(hTab+hItem), width: wItem, height: hItem },
          action: { type: "postback", data: "tap_richMenuB6" }
        }
    	]
		};
		
  	// リッチメニューを作りIdをもらう
  	const bRichMenuId = await client.createRichMenu(richmenuB);
  	console.log('bRichMenuId作成: ', bRichMenuId);
  	
  	return(bRichMenuId);
  	
	} catch (error) {
    	console.error('bRichMenuId作成エラー:', error);
  }  
  
}


// // //////////////////////////////////////////////
// ＊リッチメニュー画像のイメージファイルを読み込んで紐づける
// ＊既定値のタブ(a)を定義し(どちらを先に開くか)、
// ＊エイリアスを定義する(タブの行き来ができるようにする)
// /////////////////////////////////////////////////
async function createRichMenus(aRichMenuId, bRichMenuId) {
  try {
  	// リッチメニュー用画像ファイルをアップロードして紐づける
		const imageAPath = path.join(__dirname, '../public/images/tabA2025autumn.png');		
  	const imageAStream = fs.createReadStream(imageAPath);
  	await client.setRichMenuImage(aRichMenuId, imageAStream);
  	console.log('aRichMenu画像アップロード完了');
 	 	
  	const imageBPath = path.join(__dirname, '../public/images/tabB2025autumn.png');
  	const imageBStream = fs.createReadStream(imageBPath);
  	await client.setRichMenuImage(bRichMenuId, imageBStream);
  	console.log('bRichMenu画像アップロード完了');
  	
  	// デフォルトメニューをAにする
		await client.setDefaultRichMenu(aRichMenuId);
		console.log("aRichMenuをデフォルトに設定");
	
		// エイリアスを定義する
  	await client.createRichMenuAlias(aRichMenuId, 'switch-to-a');
  	console.log('エイリアス switch-to-a 作成');
  	
  	await client.createRichMenuAlias(bRichMenuId, 'switch-to-b');
  	console.log('エイリアス switch-to-b 作成');
  	 	
  } catch (error) {
    console.error('リッチメニュー作成エラー:', error);
  }
} 

